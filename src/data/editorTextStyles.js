export const textStyles = [
	{
		id: 'normal',
		title: 'Обычный',
		font: size => `bold ${size}px sans-serif`,
		pro: false,
	},
	{
		id: 'serif',
		title: 'Классический',
		font: size => `bold ${size}px serif`,
		pro: false,
	},
	{
		id: 'hand',
		title: 'Рукописный',
		font: size => `bold ${size}px "Comic Sans MS"`,
		pro: true,
	},
	{
		id: 'elegant',
		title: 'Элегантный',
		font: size => `bold ${size}px "Georgia"`,
		pro: true,
	},
	{
		id: 'lux',
		title: 'Люкс',
		font: size => `bold ${size}px "Times New Roman"`,
		pro: true,
	},
]
