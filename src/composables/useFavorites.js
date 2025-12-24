import { ref, watch } from 'vue'

// Реактивная переменная для списка избранных ID изображений, загружается из localStorage
const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

// Реактивная переменная для списка избранных открыток
const favoriteCards = ref(
	JSON.parse(localStorage.getItem('favoriteCards') || '[]')
)

// Composable для управления избранными изображениями
export function useFavorites() {
	// Проверяет, является ли изображение избранным
	function isFavorite(id) {
		return favorites.value.includes(id)
	}

	// Добавляет изображение в избранное
	function add(id) {
		if (!isFavorite(id)) favorites.value.push(id)
	}

	// Удаляет изображение из избранного
	function remove(id) {
		if (isFavorite(id)) favorites.value = favorites.value.filter(f => f !== id)
	}

	// Переключает статус избранного для изображения
	function toggle(id) {
		if (isFavorite(id)) remove(id)
		else add(id)
	}

	// Добавляет открытку в избранное
	function addCard(card) {
		favoriteCards.value.unshift(card)
		// Храним максимум 20 избранных открыток
		if (favoriteCards.value.length > 20) {
			favoriteCards.value = favoriteCards.value.slice(0, 20)
		}
		// Сохраняем вручную
		localStorage.setItem('favoriteCards', JSON.stringify(favoriteCards.value))
	}

	// Удаляет открытку из избранного по индексу
	function removeCard(index) {
		favoriteCards.value.splice(index, 1)
	}

	// Сохраняет изменения в localStorage при изменении списка
	watch(
		favorites,
		value => {
			localStorage.setItem('favorites', JSON.stringify(value))
		},
		{ deep: true }
	)

	// Сохраняет изменения избранных открыток в localStorage
	watch(
		favoriteCards,
		value => {
			localStorage.setItem('favoriteCards', JSON.stringify(value))
		},
		{ deep: true }
	)

	// Возвращает объект с функциями и данными
	return {
		favorites,
		favoriteCards,
		isFavorite,
		add,
		remove,
		toggle,
		addCard,
		removeCard,
	}
}
