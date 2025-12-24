// data/textStyles.js
export const textStyles = {
	classic: {
		label: 'Классический',
		font: size => `600 ${size}px Georgia, serif`,
		color: '#FFFFFF',
		shadow: {
			color: 'rgba(0,0,0,0.7)',
			blur: 8,
			x: 2,
			y: 2,
		},
		icon: '👑',
	},

	modern: {
		label: 'Современный',
		font: size => `500 ${size}px Inter, sans-serif`,
		color: '#FFFFFF',
		shadow: {
			color: 'rgba(59,130,246,0.5)',
			blur: 12,
			x: 0,
			y: 0,
		},
		icon: '💎',
	},

	italicLight: {
		label: 'Курсив светлый',
		font: size => `italic 400 ${size}px 'Times New Roman', serif`,
		color: '#F3F4F6',
		shadow: {
			color: 'rgba(0,0,0,0.5)',
			blur: 6,
			x: 1,
			y: 1,
		},
		icon: '📝',
	},

	accentColor: {
		label: 'Акцентный цвет',
		font: size => `bold ${size}px Arial, sans-serif`,
		color: '#FBBF24',
		shadow: {
			color: 'rgba(0,0,0,0.8)',
			blur: 10,
			x: 3,
			y: 3,
		},
		icon: '✨',
	},

	darkOnLight: {
		label: 'Тёмный текст',
		font: size => `600 ${size}px 'Segoe UI', sans-serif`,
		color: '#1F2937',
		shadow: {
			color: 'rgba(255,255,255,0.7)',
			blur: 8,
			x: 1,
			y: 1,
		},
		icon: '⚫',
	},

	handwritten: {
		label: 'Рукописный',
		font: size => `400 ${size}px 'Comic Sans MS', cursive`,
		color: '#FEF3C7',
		shadow: {
			color: 'rgba(107,114,128,0.5)',
			blur: 4,
			x: 2,
			y: 2,
		},
		icon: '✍️',
	},

	elegant: {
		label: 'Элегантный',
		font: size => `300 ${size}px 'Playfair Display', serif`,
		color: '#F9FAFB',
		shadow: {
			color: 'rgba(139,92,246,0.3)',
			blur: 15,
			x: 0,
			y: 0,
		},
		icon: '🎩',
	},

	festive: {
		label: 'Праздничный',
		font: size => `bold ${size}px 'Impact', fantasy`,
		color: '#FEF3C7',
		shadow: [
			{ color: '#EF4444', blur: 0, x: 4, y: 4 },
			{ color: '#10B981', blur: 0, x: 2, y: 2 },
		],
		icon: '🎊',
	},
}
