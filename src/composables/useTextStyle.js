import { ref } from 'vue'

const textStyle = ref('white')
const fontStyle = ref('bold')

export const TEXT_STYLES = {
	white: {
		name: 'Классический белый',
		color: '#ffffff',
		shadowColor: 'rgba(0,0,0,0.3)',
		icon: 'Sparkles',
	},
	gold: {
		name: 'Элегантное золото',
		color: '#FFD700',
		shadowColor: 'rgba(0,0,0,0.4)',
		icon: 'Zap',
	},
	gradient: {
		name: 'Радужный градиент',
		color: 'gradient', // special flag
		shadowColor: 'rgba(0,0,0,0.2)',
		icon: 'Palette',
	},
	pink: {
		name: 'Мягкий розовый',
		color: '#FF69B4',
		shadowColor: 'rgba(0,0,0,0.3)',
		icon: 'Heart',
	},
}

export const FONT_STYLES = {
	bold: {
		name: 'Смелый',
		font: 'bold 40px "Arial", sans-serif',
	},
	elegant: {
		name: 'Элегантный',
		font: '40px "Georgia", serif',
	},
	casual: {
		name: 'Игривый',
		font: '600 36px "Comic Sans MS", cursive',
	},
	modern: {
		name: 'Футуристичный',
		font: '600 38px "Trebuchet MS", sans-serif',
	},
}

export function useTextStyle() {
	const setTextStyle = style => {
		textStyle.value = style
	}

	const setFontStyle = font => {
		fontStyle.value = font
	}

	const getCurrentStyle = () => TEXT_STYLES[textStyle.value]
	const getCurrentFont = () => FONT_STYLES[fontStyle.value]

	return {
		textStyle,
		fontStyle,
		setTextStyle,
		setFontStyle,
		getCurrentStyle,
		getCurrentFont,
		TEXT_STYLES,
		FONT_STYLES,
	}
}
