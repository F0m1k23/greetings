export const textStyles = {
	classic: {
		label: 'Классический',
		font: size => `bold ${size}px Inter, sans-serif`,
		color: '#ffffff',
		shadow: {
			color: 'rgba(0,0,0,0.6)',
			blur: 8,
			x: 0,
			y: 2,
		},
	},

	italicLight: {
		label: 'Курсив светлый',
		font: size => `italic ${size}px Georgia, serif`,
		color: '#ffffff',
		shadow: {
			color: 'rgba(0,0,0,0.5)',
			blur: 6,
			x: 0,
			y: 2,
		},
	},

	accentColor: {
		label: 'Акцентный цвет',
		font: size => `bold ${size}px Inter, sans-serif`,
		color: '#ffb703',
		shadow: {
			color: 'rgba(0,0,0,0.7)',
			blur: 10,
			x: 0,
			y: 3,
		},
	},

	darkOnLight: {
		label: 'Тёмный текст',
		font: size => `bold ${size}px Inter, sans-serif`,
		color: '#1f2933',
		shadow: {
			color: 'rgba(255,255,255,0.6)',
			blur: 6,
			x: 0,
			y: 2,
		},
	},
}
