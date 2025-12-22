export async function createGreetingImage({ imageUrl, text }) {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	canvas.width = 1080
	canvas.height = 1350

	// --- load image
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.src = imageUrl
	await new Promise(resolve => (img.onload = resolve))

	// --- draw image
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

	// --- subtle dark overlay (VERY soft)
	ctx.fillStyle = 'rgba(0,0,0,0.18)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// --- FRAME (inside image)
	const frameWidth = canvas.width * 0.72
	const frameHeight = canvas.height * 0.26
	const frameX = (canvas.width - frameWidth) / 2
	const frameY = canvas.height * 0.52
	const radius = 34

	// --- background under frame (slightly darker)
	ctx.fillStyle = 'rgba(0,0,0,0.22)'
	ctx.beginPath()
	roundRect(ctx, frameX, frameY, frameWidth, frameHeight, radius)
	ctx.fill()

	// --- glass effect (almost transparent)
	ctx.shadowColor = 'rgba(255,255,255,0.18)'
	ctx.shadowBlur = 28

	ctx.fillStyle = 'rgba(255,255,255,0.08)'
	ctx.beginPath()
	roundRect(ctx, frameX, frameY, frameWidth, frameHeight, radius)
	ctx.fill()

	// --- thin inner stroke
	ctx.shadowBlur = 0
	ctx.strokeStyle = 'rgba(255,255,255,0.22)'
	ctx.lineWidth = 1.5
	ctx.stroke()

	// --- TEXT
	ctx.fillStyle = '#ffffff'
	ctx.font = '600 44px "Inter", system-ui, sans-serif'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'top'

	// super soft text shadow
	ctx.shadowColor = 'rgba(0,0,0,0.35)'
	ctx.shadowBlur = 6

	wrapText(ctx, text, canvas.width / 2, frameY + 64, frameWidth - 120, 56)

	// --- tiny accent dot (not emoji)
	ctx.shadowBlur = 0
	ctx.fillStyle = 'rgba(255,255,255,0.7)'
	ctx.beginPath()
	ctx.arc(canvas.width / 2, frameY + frameHeight - 48, 4, 0, Math.PI * 2)
	ctx.fill()

	return canvas.toDataURL('image/png')
}
