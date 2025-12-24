export function useGreetingCanvas(canvasRef, width, height) {
	function drawImage(ctx, src) {
		return new Promise(resolve => {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.onload = () => {
				ctx.drawImage(img, 0, 0, width, height)
				resolve()
			}
			img.src = src
		})
	}

	function drawText(ctx, text, style, fontSize) {
		ctx.font = style.font(fontSize)
		ctx.fillStyle = style.color
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'

		// тень — ВСЕГДА
		ctx.shadowColor = style.shadow.color
		ctx.shadowBlur = style.shadow.blur
		ctx.shadowOffsetX = style.shadow.x
		ctx.shadowOffsetY = style.shadow.y

		wrapText(ctx, text, width / 2, height / 2, width - 60, fontSize * 1.3)
	}

	function drawFrame(ctx, frame) {
		frame?.draw?.(ctx, width, height)
	}

	async function draw({ imageSrc, text, textStyle, frame, fontSize }) {
		const canvas = canvasRef.value
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, width, height)

		await drawImage(ctx, imageSrc)
		drawFrame(ctx, frame)
		drawText(ctx, text, textStyle, fontSize)
	}

	function toBlob() {
		return new Promise(resolve => {
			canvasRef.value.toBlob(blob => resolve(blob), 'image/png')
		})
	}

	return { draw, toBlob }
}

/* ===== helpers ===== */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
	const words = text.split(' ')
	const lines = []
	let line = ''

	words.forEach(word => {
		const test = line ? line + ' ' + word : word
		if (ctx.measureText(test).width > maxWidth && line) {
			lines.push(line)
			line = word
		} else {
			line = test
		}
	})
	lines.push(line)

	const startY = y - ((lines.length - 1) * lineHeight) / 2
	lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}
