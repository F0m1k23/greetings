export const frames = {
	none: {
		label: 'Без рамки',
		draw: () => {},
	},

	soft: {
		label: 'Мягкая рамка',
		draw(ctx, w, h) {
			ctx.strokeStyle = 'rgba(255,255,255,0.6)'
			ctx.lineWidth = 8
			ctx.strokeRect(10, 10, w - 20, h - 20)
		},
	},

	dark: {
		label: 'Тёмная рамка',
		draw(ctx, w, h) {
			ctx.strokeStyle = 'rgba(0,0,0,0.6)'
			ctx.lineWidth = 10
			ctx.strokeRect(12, 12, w - 24, h - 24)
		},
	},
}
