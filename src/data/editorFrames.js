const frames = [
	{
		id: 'none',
		title: 'Без рамки',
		draw(ctx) {
			// Ничего не рисуем - чистый холст
		},
	},
	{
		id: 'minimal-black',
		title: 'Тонкая черная',
		draw(ctx) {
			// Очень тонкая черная рамка
			ctx.strokeStyle = '#1a1a1a'
			ctx.lineWidth = 3
			ctx.strokeRect(15, 15, 1050, 1320)
		},
	},
	{
		id: 'soft-gray',
		title: 'Мягкий серый',
		draw(ctx) {
			// Мягкая серая рамка с легким свечением
			ctx.strokeStyle = '#9ca3af'
			ctx.lineWidth = 8
			ctx.shadowColor = 'rgba(156, 163, 175, 0.3)'
			ctx.shadowBlur = 8
			ctx.strokeRect(20, 20, 1040, 1310)
		},
	},
	{
		id: 'pastel-gradient',
		title: 'Пастельный градиент',
		draw(ctx) {
			// Мягкий пастельный градиент
			const gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
			gradient.addColorStop(0, '#fce7f3')
			gradient.addColorStop(0.5, '#e0e7ff')
			gradient.addColorStop(1, '#ecfdf5')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 12
			ctx.shadowColor = 'rgba(252, 231, 243, 0.4)'
			ctx.shadowBlur = 12
			ctx.strokeRect(18, 18, 1044, 1314)
		},
	},
	{
		id: 'elegant-gold',
		title: 'Элегантное золото',
		draw(ctx) {
			// Сдержанная золотая рамка
			ctx.strokeStyle = '#d4af37'
			ctx.lineWidth = 20
			ctx.shadowColor = 'rgba(212, 175, 55, 0.5)'
			ctx.shadowBlur = 15
			ctx.strokeRect(20, 20, 1040, 1310)

			// Внутренняя тонкая линия
			ctx.strokeStyle = '#ffd700'
			ctx.lineWidth = 4
			ctx.shadowBlur = 0
			ctx.strokeRect(40, 40, 1000, 1270)
		},
	},
	{
		id: 'corner-dots',
		title: 'Угловые точки',
		draw(ctx) {
			// Тонкие линии с точками по углам
			ctx.strokeStyle = '#6b7280'
			ctx.lineWidth = 2
			ctx.strokeRect(20, 20, 1040, 1310)

			// Маленькие точки по углам
			ctx.fillStyle = '#6b7280'
			const dots = [
				[20, 20],
				[1060, 20],
				[20, 1330],
				[1060, 1330],
			]
			dots.forEach(([x, y]) => {
				ctx.beginPath()
				ctx.arc(x, y, 4, 0, Math.PI * 2)
				ctx.fill()
			})
		},
	},
	{
		id: 'subtle-shadow',
		title: 'Легкая тень',
		draw(ctx) {
			// Рамка с мягкой внутренней тенью
			ctx.strokeStyle = '#f3f4f6'
			ctx.lineWidth = 25
			ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
			ctx.shadowBlur = 20
			ctx.shadowOffsetX = 5
			ctx.shadowOffsetY = 5
			ctx.strokeRect(15, 15, 1050, 1320)
		},
	},
	{
		id: 'minimalist-white',
		title: 'Минималистская белая',
		draw(ctx) {
			// Простая белая рамка
			ctx.strokeStyle = '#ffffff'
			ctx.lineWidth = 15
			ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
			ctx.shadowBlur = 10
			ctx.strokeRect(25, 25, 1030, 1300)
		},
	},
	{
		id: 'double-line',
		title: 'Двойная линия',
		draw(ctx) {
			// Двойная рамка с разными цветами
			ctx.strokeStyle = '#374151'
			ctx.lineWidth = 6
			ctx.strokeRect(15, 15, 1050, 1320)

			ctx.strokeStyle = '#d1d5db'
			ctx.lineWidth = 2
			ctx.strokeRect(25, 25, 1030, 1300)
		},
	},
	{
		id: 'rounded-corners',
		title: 'Закругленные углы',
		draw(ctx) {
			// Рамка с закругленными углами
			ctx.strokeStyle = '#6b7280'
			ctx.lineWidth = 8
			ctx.lineJoin = 'round'
			ctx.lineCap = 'round'

			const radius = 40
			ctx.beginPath()
			ctx.moveTo(radius + 20, 20)
			ctx.lineTo(1060 - radius, 20)
			ctx.arcTo(1060, 20, 1060, 20 + radius, radius)
			ctx.lineTo(1060, 1330 - radius)
			ctx.arcTo(1060, 1330, 1060 - radius, 1330, radius)
			ctx.lineTo(20 + radius, 1330)
			ctx.arcTo(20, 1330, 20, 1330 - radius, radius)
			ctx.lineTo(20, 20 + radius)
			ctx.arcTo(20, 20, 20 + radius, 20, radius)
			ctx.closePath()
			ctx.stroke()
		},
	},
	{
		id: 'warm-gradient',
		title: 'Теплый градиент',
		draw(ctx) {
			// Мягкий теплый градиент
			const gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
			gradient.addColorStop(0, '#fef3c7')
			gradient.addColorStop(0.5, '#fde68a')
			gradient.addColorStop(1, '#f59e0b')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 16
			ctx.shadowColor = 'rgba(245, 158, 11, 0.3)'
			ctx.shadowBlur = 15
			ctx.strokeRect(16, 16, 1048, 1318)
		},
	},
	{
		id: 'elegant-gold',
		title: 'Элегантное золото',
		draw(ctx) {
			// Сдержанная золотая рамка без излишеств
			const gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
			gradient.addColorStop(0, '#f59e0b')
			gradient.addColorStop(1, '#d97706')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 14
			ctx.shadowColor = 'rgba(245, 158, 11, 0.4)'
			ctx.shadowBlur = 12
			ctx.strokeRect(18, 18, 1044, 1314)

			// Тонкая внутренняя линия
			ctx.strokeStyle = '#fbbf24'
			ctx.lineWidth = 3
			ctx.shadowBlur = 0
			ctx.strokeRect(35, 35, 1010, 1280)
		},
	},
]

export default frames
