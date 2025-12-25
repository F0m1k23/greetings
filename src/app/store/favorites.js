import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { toast } from 'vue3-toastify'

export const useFavoritesStore = defineStore('favorites', () => {
	// state
	const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

	// helpers
	const isFavorite = card =>
		favorites.value.some(
			fav => fav.id === card.id && fav.holiday === card.holiday
		)

	// actions
	const addToFavorites = card => {
		if (!isFavorite(card)) {
			favorites.value.push({
				id: card.id,
				holiday: card.holiday,
				image: card.image,
			})
		}
	}

	const removeFromFavorites = card => {
		const index = favorites.value.findIndex(
			fav => fav.id === card.id && fav.holiday === card.holiday
		)
		if (index !== -1) {
			favorites.value.splice(index, 1)
		}
	}

	const toggle = card => {
		if (isFavorite(card)) {
			removeFromFavorites(card)
		} else {
			addToFavorites(card)
		}
	}

	// persist (БЕЗ ИЗМЕНЕНИЙ ЛОГИКИ)
	watch(
		favorites,
		value => {
			localStorage.setItem('favorites', JSON.stringify(value))
		},
		{ deep: true }
	)

	// getter
	const allFavorites = computed(() => favorites.value)

	return {
		favorites,
		allFavorites,
		isFavorite,
		addToFavorites,
		removeFromFavorites,
		toggle,
	}
})
