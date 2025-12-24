// data/frames.js
export const frames = {
	none: {
		label: 'Без рамки',
		draw: () => {},
		icon: '🚫',
	},

	soft: {
		label: 'Мягкая белая',
		draw(ctx, w, h) {
			ctx.strokeStyle = 'rgba(255,255,255,0.7)'
			ctx.lineWidth = 12
			ctx.lineJoin = 'round'
			ctx.strokeRect(15, 15, w - 30, h - 30)
		},
		icon: '⚪',
	},

	dark: {
		label: 'Тёмная рамка',
		draw(ctx, w, h) {
			ctx.strokeStyle = 'rgba(0,0,0,0.7)'
			ctx.lineWidth = 14
			ctx.lineJoin = 'round'
			ctx.strokeRect(12, 12, w - 24, h - 24)
		},
		icon: '⚫',
	},

	golden: {
		label: 'Золотая',
		draw(ctx, w, h) {
			// Градиент для золотой рамки
			const gradient = ctx.createLinearGradient(0, 0, w, h)
			gradient.addColorStop(0, '#FFD700')
			gradient.addColorStop(0.5, '#FFEC8B')
			gradient.addColorStop(1, '#FFD700')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 18
			ctx.lineJoin = 'round'
			ctx.strokeRect(10, 10, w - 20, h - 20)
		},
		icon: '🌟',
	},

	festive: {
		label: 'Праздничная',
		draw(ctx, w, h) {
			// Чередующиеся цвета для праздничной рамки
			ctx.strokeStyle = '#EF4444' // Красный
			ctx.lineWidth = 8
			ctx.setLineDash([20, 10])
			ctx.strokeRect(10, 10, w - 20, h - 20)

			ctx.strokeStyle = '#10B981' // Зеленый
			ctx.lineWidth = 8
			ctx.setLineDash([10, 20])
			ctx.strokeRect(14, 14, w - 28, h - 28)

			ctx.setLineDash([]) // Сбросить пунктир
		},
		icon: '🎉',
	},

	vintage: {
		label: 'Винтажная',
		draw(ctx, w, h) {
			// Текстурная рамка с узором
			ctx.strokeStyle = '#8B4513'
			ctx.lineWidth = 16
			ctx.strokeRect(8, 8, w - 16, h - 16)

			// Внутренняя линия
			ctx.strokeStyle = '#D2691E'
			ctx.lineWidth = 4
			ctx.strokeRect(16, 16, w - 32, h - 32)
		},
		icon: '🏺',
	},

	modern: {
		label: 'Современная',
		draw(ctx, w, h) {
			// Минималистичная двойная рамка
			ctx.strokeStyle = '#3B82F6'
			ctx.lineWidth = 2
			ctx.strokeRect(5, 5, w - 10, h - 10)

			ctx.strokeStyle = '#60A5FA'
			ctx.lineWidth = 2
			ctx.strokeRect(15, 15, w - 30, h - 30)

			// Угловые акценты
			ctx.fillStyle = '#3B82F6'
			const cornerSize = 20
			;[
				[5, 5],
				[w - 5, 5],
				[5, h - 5],
				[w - 5, h - 5],
			].forEach(([x, y]) => {
				ctx.fillRect(
					x - cornerSize / 2,
					y - cornerSize / 2,
					cornerSize,
					cornerSize
				)
			})
		},
		icon: '🔷',
	},

	floral: {
		label: 'Цветочная',
		draw(ctx, w, h) {
			// Рамка с цветочным узором
			const drawFlower = (x, y, size) => {
				ctx.fillStyle = '#EC4899'
				ctx.beginPath()
				for (let i = 0; i < 5; i++) {
					const angle = (i * 2 * Math.PI) / 5
					const px = x + size * Math.cos(angle)
					const py = y + size * Math.sin(angle)
					if (i === 0) ctx.moveTo(px, py)
					else ctx.lineTo(px, py)
				}
				ctx.closePath()
				ctx.fill()

				// Центр цветка
				ctx.fillStyle = '#F59E0B'
				ctx.beginPath()
				ctx.arc(x, y, size / 3, 0, 2 * Math.PI)
				ctx.fill()
			}

			// Цветки по углам
			const size = 30
			drawFlower(30, 30, size)
			drawFlower(w - 30, 30, size)
			drawFlower(30, h - 30, size)
			drawFlower(w - 30, h - 30, size)
		},
		icon: '🌺',
	},

	romantic: {
		label: 'Романтическая',
		draw(ctx, w, h) {
			// Розовая рамка с сердечками
			ctx.strokeStyle = '#F472B6'
			ctx.lineWidth = 12
			ctx.lineJoin = 'round'
			ctx.strokeRect(15, 15, w - 30, h - 30)

			// Маленькие сердечки по углам
			const drawHeart = (x, y, size) => {
				ctx.fillStyle = '#F472B6'
				ctx.beginPath()
				ctx.moveTo(x, y + size / 4)
				ctx.quadraticCurveTo(x, y, x + size / 4, y)
				ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4)
				ctx.quadraticCurveTo(x + size / 2, y, x + (3 * size) / 4, y)
				ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4)
				ctx.quadraticCurveTo(x + size, y + size / 2, x + size / 2, y + size)
				ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4)
				ctx.fill()
			}

			const heartSize = 20
			drawHeart(25, 25, heartSize)
			drawHeart(w - 25, 25, heartSize)
			drawHeart(25, h - 25, heartSize)
			drawHeart(w - 25, h - 25, heartSize)
		},
		icon: '💖',
	},

	neon: {
		label: 'Неоновая',
		draw(ctx, w, h) {
			// Неоновый эффект
			ctx.shadowColor = '#00FFFF'
			ctx.shadowBlur = 20

			ctx.strokeStyle = '#00FFFF'
			ctx.lineWidth = 6
			ctx.strokeRect(10, 10, w - 20, h - 20)

			ctx.shadowColor = '#FF00FF'
			ctx.shadowBlur = 15
			ctx.strokeStyle = '#FF00FF'
			ctx.lineWidth = 3
			ctx.strokeRect(15, 15, w - 30, h - 30)

			// Сброс тени
			ctx.shadowColor = 'transparent'
			ctx.shadowBlur = 0
		},
		icon: '⚡',
	},

	wooden: {
		label: 'Деревянная',
		draw(ctx, w, h) {
			// Деревянная текстура
			const gradient = ctx.createLinearGradient(0, 0, w, h)
			gradient.addColorStop(0, '#8B4513')
			gradient.addColorStop(0.5, '#A0522D')
			gradient.addColorStop(1, '#8B4513')

			ctx.fillStyle = gradient
			ctx.fillRect(0, 0, w, h)

			// Рисунок дерева
			ctx.strokeStyle = '#654321'
			ctx.lineWidth = 2
			for (let i = 20; i < h; i += 15) {
				ctx.beginPath()
				ctx.moveTo(0, i)
				ctx.lineTo(w, i)
				ctx.stroke()
			}
		},
		icon: '🌳',
	},

	gradient: {
		label: 'Градиентная',
		draw(ctx, w, h) {
			// Радужный градиент
			const gradient = ctx.createLinearGradient(0, 0, w, h)
			gradient.addColorStop(0, '#FF0000')
			gradient.addColorStop(0.2, '#FF8000')
			gradient.addColorStop(0.4, '#FFFF00')
			gradient.addColorStop(0.6, '#00FF00')
			gradient.addColorStop(0.8, '#0000FF')
			gradient.addColorStop(1, '#8000FF')

			ctx.strokeStyle = gradient
			ctx.lineWidth = 20
			ctx.lineJoin = 'round'
			ctx.strokeRect(10, 10, w - 20, h - 20)
		},
		icon: '🌈',
	},
}
