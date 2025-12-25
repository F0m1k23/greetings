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
	const textStyle = ref('normal')
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
		canvas.width = 1080
		canvas.height = 1350
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

		ctx.clearRect(0, 0, 1080, 1350)
		ctx.drawImage(image.value, 0, 0, 1080, 1350)

		// Apply text style with proper size
		const styleMap = {
			normal: `bold ${textSizeNum.value}px sans-serif`,
			bold: `bold ${textSizeNum.value}px sans-serif`,
			italic: `italic ${textSizeNum.value}px sans-serif`,
			serif: `normal ${textSizeNum.value}px Georgia, serif`,
			cursive: `normal ${textSizeNum.value}px cursive`,
			fantasy: `bold ${textSizeNum.value}px fantasy`,
			elegant: `italic ${textSizeNum.value}px 'Times New Roman', serif`,
			modern: `bold ${textSizeNum.value}px sans-serif`,
			vintage: `normal ${textSizeNum.value}px Georgia, serif`,
			luxury: `bold italic ${textSizeNum.value}px 'Times New Roman', serif`,
		}

		ctx.font = styleMap[textStyle.value] || styleMap.normal
		ctx.textAlign = 'center'
		ctx.textBaseline = 'top'

		const padding = 80
		const maxWidth = 1080 - padding * 2
		const lineHeight = textSizeNum.value + 12

		const lines = calculateLines(text.value, maxWidth)
		const blockHeight = lines.length * lineHeight

		let startY = 1350 - blockHeight - 120
		if (textPosition.value === 'top') startY = 120
		if (textPosition.value === 'center') startY = (1350 - blockHeight) / 2

		// TEXT BOX
		if (textBox.value !== 'none') {
			const boxPad = 40
			const boxX = 540 - maxWidth / 2 - boxPad
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
			if (textStroke.value) ctx.strokeText(line, 540, y)
			ctx.fillText(line, 540, y)
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

	function setTextStyle(style) {
		textStyle.value = style
		debouncedDraw()
	}

	function selectFrame(frame) {
		selectedFrame.value = frame
		draw()
	}

	function download() {
		const dataUrl = canvasRef.value.toDataURL('image/png')

		// Если в Telegram Web App, используем Telegram API
		if (window.Telegram?.WebApp) {
			// Показываем изображение пользователю для сохранения
			window.Telegram.WebApp.showPopup({
				title: 'Открытка готова!',
				message: 'Длинное нажатие на изображение ниже для сохранения',
				buttons: [
					{
						type: 'default',
						text: 'OK',
					},
				],
			})

			// Создаем временное изображение для показа
			const img = new Image()
			img.src = dataUrl
			img.style.maxWidth = '100%'
			img.style.height = 'auto'

			// Показываем в alert или popup
			setTimeout(() => {
				alert(
					'Изображение готово! Используйте функцию "Сохранить изображение" вашего браузера.'
				)
			}, 100)
		} else {
			// Для обычного браузера
			try {
				const link = document.createElement('a')
				link.href = dataUrl
				link.download = 'postcard.png'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			} catch (error) {
				// Fallback: открыть в новой вкладке
				window.open(dataUrl, '_blank')
			}
		}
	}

	async function sendToTelegram() {
		sending.value = true

		try {
			// 1. Получаем blob (ВАЖНО: без fetch внешнего URL)
			const blob = await new Promise((resolve, reject) => {
				canvasRef.value.toBlob(
					b => (b ? resolve(b) : reject(new Error('Blob error'))),
					'image/png'
				)
			})

			// 2. Отправляем НА СЕРВЕР
			const formData = new FormData()
			formData.append('image', blob, 'postcard.png')

			const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
				method: 'POST',
				body: formData,
			})

			if (!uploadRes.ok) {
				throw new Error('Upload failed')
			}

			return true
		} catch (e) {
			throw e
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
		textStyle,
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
		setTextStyle,
		selectFrame,
		download,
		sendToTelegram,
	}
}
