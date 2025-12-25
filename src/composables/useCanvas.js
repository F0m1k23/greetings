import { ref, computed } from 'vue'
import { debounce } from '@/utils/debounce'

export function useCanvas() {
	const canvasRef = ref(null)
	let ctx = null

	// State
	const holiday = ref('newyear')
	const images = ref([])
	const texts = ref([])
	const selectedImageSrc = ref('')
	const image = ref(null)
	const textMode = ref('preset')
	const text = ref('')
	const textSize = ref(36)
	const textPosition = ref('bottom')
	const textColor = ref('#ffffff')
	const textStroke = ref(true)
	const textBox = ref('soft')
	const selectedFrame = ref(null)
	const activeTab = ref('general')
	const sending = ref(false)
	const loadingImage = ref(false)

	const textSizeNum = computed(() => Number(textSize.value))

	// Debounced draw function
	const debouncedDraw = debounce(() => {
		try {
			draw()
		} catch (error) {
			console.error('Error drawing canvas:', error)
		}
	}, 100)

	// Init
	function initCanvas() {
		const canvas = canvasRef.value
		canvas.width = 800
		canvas.height = 1000
		ctx = canvas.getContext('2d')
	}

	// Helpers
	function calculateLines(text, maxWidth) {
		const words = text.split(' ')
		let line = ''
		const lines = []

		for (let w of words) {
			const test = line + w + ' '
			if (ctx.measureText(test).width > maxWidth && line) {
				lines.push(line.trim())
				line = w + ' '
			} else {
				line = test
			}
		}

		if (line) lines.push(line.trim())
		return lines
	}

	// Draw
	function draw() {
		if (!image.value) return

		ctx.clearRect(0, 0, 800, 1000)
		ctx.drawImage(image.value, 0, 0, 800, 1000)

		ctx.font = `bold ${textSizeNum.value}px sans-serif`
		ctx.textAlign = 'center'
		ctx.textBaseline = 'top'

		const padding = 60
		const maxWidth = 800 - padding * 2
		const lineHeight = textSizeNum.value + 12

		const lines = calculateLines(text.value, maxWidth)
		const blockHeight = lines.length * lineHeight

		let startY = 1000 - blockHeight - 80
		if (textPosition.value === 'top') startY = 80
		if (textPosition.value === 'center') startY = (1000 - blockHeight) / 2

		// TEXT BOX
		if (textBox.value !== 'none') {
			const boxPad = 28
			const boxX = padding - boxPad
			const boxY = startY - boxPad
			const boxW = maxWidth + boxPad * 2
			const boxH = blockHeight + boxPad * 2

			if (textBox.value === 'soft') {
				ctx.fillStyle = 'rgba(0,0,0,0.35)'
				ctx.fillRect(boxX, boxY, boxW, boxH)
			}

			if (textBox.value === 'border') {
				ctx.strokeStyle = 'rgba(255,255,255,0.6)'
				ctx.lineWidth = 2
				ctx.strokeRect(boxX, boxY, boxW, boxH)
			}
		}

		// TEXT
		ctx.fillStyle = textColor.value

		if (textStroke.value) {
			ctx.strokeStyle = 'rgba(0,0,0,0.45)'
			ctx.lineWidth = Math.max(2, textSizeNum.value / 14)
		}

		lines.forEach((line, i) => {
			const y = startY + i * lineHeight
			if (textStroke.value) ctx.strokeText(line, 400, y)
			ctx.fillText(line, 400, y)
		})

		// FRAME
		if (selectedFrame.value) {
			selectedFrame.value.draw(ctx)
		}
	}

	// Actions
	function onHolidayChange(templates, editorTexts, frames) {
		images.value = (
			templates[holiday.value] ||
			templates.universal ||
			[]
		).filter(Boolean)
		texts.value = editorTexts[holiday.value] || editorTexts.universal || []
		text.value = texts.value[0] || ''
		selectImage(images.value[0]?.image)

		if (!selectedFrame.value && frames.length > 0) {
			selectedFrame.value = frames[0]
		}
	}

	function selectImage(src) {
		if (!src) return
		selectedImageSrc.value = src
		loadingImage.value = true
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = src
		img.onload = () => {
			image.value = img
			loadingImage.value = false
			draw()
		}
		img.onerror = () => {
			loadingImage.value = false
			console.error('Failed to load image:', src)
		}
	}

	function setPosition(pos) {
		textPosition.value = pos
		debouncedDraw()
	}

	function setTextBox(type) {
		textBox.value = type
		debouncedDraw()
	}

	function selectFrame(frame) {
		selectedFrame.value = frame
		draw()
	}

	function download() {
		const link = document.createElement('a')
		link.href = canvasRef.value.toDataURL('image/png')
		link.download = 'postcard.png'
		link.click()
	}

	async function sendToTelegram() {
		sending.value = true

		try {
			const blob = await new Promise((resolve, reject) => {
				canvasRef.value.toBlob(
					b => (b ? resolve(b) : reject(new Error('Blob generation failed'))),
					'image/png'
				)
			})

			const formData = new FormData()
			formData.append('image', blob, 'postcard.png')

			const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
				method: 'POST',
				body: formData,
			})

			if (!uploadRes.ok) throw new Error('Ошибка загрузки изображения')

			const { imageId } = await uploadRes.json()

			const sendRes = await fetch(`${import.meta.env.VITE_API_URL}/send`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chatId: import.meta.env.VITE_BOT_CHAT_ID,
					imageId,
				}),
			})

			if (!sendRes.ok) throw new Error('Ошибка отправки')

			return true
		} catch (error) {
			throw error
		} finally {
			sending.value = false
		}
	}

	return {
		canvasRef,
		ctx,
		holiday,
		images,
		texts,
		selectedImageSrc,
		textMode,
		text,
		textSize,
		textSizeNum,
		textPosition,
		textColor,
		textStroke,
		textBox,
		selectedFrame,
		activeTab,
		sending,
		loadingImage,
		initCanvas,
		draw,
		debouncedDraw,
		onHolidayChange,
		selectImage,
		setPosition,
		setTextBox,
		selectFrame,
		download,
		sendToTelegram,
	}
}
