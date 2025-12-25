const frames = [
	{
		id: 'elegant-gold',
		title: 'Элегантное золото',
		pro: false,
		draw(ctx) {
			// Сдержанная золотая рамка
			ctx.strokeStyle = '#d4af37'
			ctx.lineWidth = 20
			ctx.shadowColor = 'rgba(212, 175, 55, 0.5)'
			ctx.shadowBlur = 15
			ctx.strokeRect(20, 20, 760, 960)

			// Внутренняя тонкая линия
			ctx.strokeStyle = '#ffd700'
			ctx.lineWidth = 4
			ctx.shadowBlur = 0
			ctx.strokeRect(40, 40, 720, 920)
		},
	},
	{
		id: 'soft-silver',
		title: 'Мягкое серебро',
		pro: false,
		draw(ctx) {
			// Серебряная рамка с мягким блеском
			ctx.strokeStyle = '#c0c0c0'
			ctx.lineWidth = 18
			ctx.shadowColor = 'rgba(192, 192, 192, 0.4)'
			ctx.shadowBlur = 12
			ctx.strokeRect(22, 22, 756, 956)

			// Внутренний контур
			ctx.strokeStyle = '#e0e0e0'
			ctx.lineWidth = 3
			ctx.shadowBlur = 0
			ctx.strokeRect(42, 42, 716, 916)
		},
	},
	{
		id: 'minimalist-white',
		title: 'Минималистская белая',
		pro: false,
		draw(ctx) {
			// Простая белая рамка
			ctx.strokeStyle = '#ffffff'
			ctx.lineWidth = 15
			ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
			ctx.shadowBlur = 10
			ctx.strokeRect(25, 25, 750, 950)
		},
	},
	{
		id: 'royal-platinum',
		title: 'Королевская платина',
		pro: true,
		draw(ctx) {
			// Роскошная платиновая рамка
			const gradient = ctx.createLinearGradient(0, 0, 800, 1000)
			gradient.addColorStop(0, '#e5e4e2')
			gradient.addColorStop(1, '#b8b8b8')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 28
			ctx.shadowColor = 'rgba(229, 228, 226, 0.6)'
			ctx.shadowBlur = 20
			ctx.strokeRect(18, 18, 764, 964)

			// Внутренний глянцевый эффект
			ctx.strokeStyle = '#ffffff'
			ctx.lineWidth = 8
			ctx.shadowBlur = 0
			ctx.strokeRect(38, 38, 724, 924)

			// Декоративные элементы
			ctx.fillStyle = '#ffffff'
			ctx.shadowColor = 'rgba(255, 255, 255, 0.7)'
			ctx.shadowBlur = 10

			const points = [
				[50, 50],
				[750, 50],
				[50, 950],
				[750, 950],
				[100, 100],
				[700, 100],
				[100, 900],
				[700, 900],
			]

			points.forEach(([x, y]) => {
				ctx.beginPath()
				ctx.arc(x, y, 4, 0, Math.PI * 2)
				ctx.fill()
			})
		},
	},
	{
		id: 'crystal-elegance',
		title: 'Хрустальная элегантность',
		pro: true,
		draw(ctx) {
			// Хрустальная рамка с мягким сиянием
			ctx.strokeStyle = 'rgba(240, 248, 255, 0.9)'
			ctx.lineWidth = 24
			ctx.shadowColor = 'rgba(173, 216, 230, 0.5)'
			ctx.shadowBlur = 25
			ctx.strokeRect(20, 20, 760, 960)

			// Внутренний контур
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
			ctx.lineWidth = 6
			ctx.shadowBlur = 0
			ctx.strokeRect(40, 40, 720, 920)

			// Кристаллические узоры
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
			ctx.lineWidth = 2

			const corners = [
				[30, 30],
				[770, 30],
				[30, 970],
				[770, 970],
			]

			corners.forEach(([x, y]) => {
				ctx.beginPath()
				for (let i = 0; i < 8; i++) {
					const angle = (Math.PI * 2 * i) / 8
					const length = 20
					const endX = x + Math.cos(angle) * length
					const endY = y + Math.sin(angle) * length
					ctx.moveTo(x, y)
					ctx.lineTo(endX, endY)
				}
				ctx.stroke()
			})
		},
	},
	{
		id: 'luxury-golden',
		title: 'Роскошное золото',
		pro: true,
		draw(ctx) {
			// Роскошная золотая рамка
			const gradient = ctx.createLinearGradient(0, 0, 800, 1000)
			gradient.addColorStop(0, '#ffd700')
			gradient.addColorStop(0.5, '#daa520')
			gradient.addColorStop(1, '#b8860b')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 30
			ctx.shadowColor = 'rgba(218, 165, 32, 0.7)'
			ctx.shadowBlur = 25
			ctx.strokeRect(15, 15, 770, 970)

			// Внутренний контур
			ctx.strokeStyle = '#ffd700'
			ctx.lineWidth = 10
			ctx.shadowBlur = 0
			ctx.strokeRect(35, 35, 730, 930)

			// Угловые украшения
			ctx.fillStyle = '#ffd700'
			ctx.shadowColor = 'rgba(218, 165, 32, 0.5)'
			ctx.shadowBlur = 10

			const drawCorner = (x, y, rotation) => {
				ctx.save()
				ctx.translate(x, y)
				ctx.rotate(rotation)

				ctx.beginPath()
				ctx.moveTo(0, 0)
				ctx.bezierCurveTo(20, -30, 50, -15, 35, 15)
				ctx.bezierCurveTo(20, 40, -20, 25, 0, 0)
				ctx.fill()

				ctx.restore()
			}

			drawCorner(50, 50, 0)
			drawCorner(750, 50, Math.PI / 2)
			drawCorner(50, 950, -Math.PI / 2)
			drawCorner(750, 950, Math.PI)
		},
	},
]

export default frames
