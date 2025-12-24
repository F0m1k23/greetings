<template>
	<!-- Карточка категории с иконкой и заголовком -->
	<div
		class="bg-gray-800 border border-gray-600 rounded-lg p-6 min-h-[180px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-700 transition-colors active:scale-95"
		@click="$emit('select', card)"
	>
		<div
			class="w-12 h-12 bg-gray-600 text-gray-100 rounded-lg flex items-center justify-center mb-3"
		>
			<span class="text-xl">{{ card.icon || '✦' }}</span>
		</div>

		<h3 class="text-lg font-medium text-gray-100">
			{{ card.title }}
		</h3>
	</div>
</template>

<script setup>
// Определение пропсов компонента
const props = defineProps({
	// Объект карточки категории
	card: {
		type: Object,
		required: true,
	},
})

// Определение событий, которые компонент может emit
defineEmits(['select'])
</script>
