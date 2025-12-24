import { ref, watch } from 'vue'

// Реактивная переменная для списка избранных ID изображений, загружается из localStorage
const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

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

	// Сохраняет изменения в localStorage при изменении списка
	watch(
		favorites,
		value => {
			localStorage.setItem('favorites', JSON.stringify(value))
		},
		{ deep: true }
	)

	// Возвращает объект с функциями и данными
	return {
		favorites,
		isFavorite,
		add,
		remove,
		toggle,
	}
}
