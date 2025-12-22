import { ref } from 'vue'

const caption = ref('')

export function useCaption() {
	const setCaption = text => {
		caption.value = text
	}

	const clearCaption = () => {
		caption.value = ''
	}

	return {
		caption,
		setCaption,
		clearCaption,
	}
}
