import { ref, watch } from 'vue'

const STORAGE_KEY = 'favorites'

const favorites = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

watch(
	favorites,
	val => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
	},
	{ deep: true }
)

export function useFavorites() {
	const isFavorite = id => favorites.value.includes(id)

	const toggleFavorite = id => {
		if (isFavorite(id)) {
			favorites.value = favorites.value.filter(f => f !== id)
		} else {
			favorites.value.push(id)
		}
	}

	return {
		favorites,
		isFavorite,
		toggleFavorite,
	}
}
