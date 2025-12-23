import { ref, watch } from 'vue'

const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

export function useFavorites() {
	function isFavorite(id) {
		return favorites.value.includes(id)
	}

	function add(id) {
		if (!isFavorite(id)) favorites.value.push(id)
	}

	function remove(id) {
		if (isFavorite(id)) favorites.value = favorites.value.filter(f => f !== id)
	}

	function toggle(id) {
		if (isFavorite(id)) remove(id)
		else add(id)
	}

	watch(
		favorites,
		value => {
			localStorage.setItem('favorites', JSON.stringify(value))
		},
		{ deep: true }
	)

	return {
		favorites,
		isFavorite,
		add,
		remove,
		toggle,
	}
}
