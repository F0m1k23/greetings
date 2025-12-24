<template>
	<div
		class="min-h-screen bg-gray-900 text-white p-5 max-w-4xl mx-auto pb-20 space-y-5"
	>
		<div class="flex items-center gap-4 mb-6">
			<button
				@click="goBack"
				class="text-gray-400 hover:text-white transition-colors"
			>
				<i class="fas fa-arrow-left text-xl"></i>
			</button>
			<div>
				<h1 class="text-2xl font-semibold text-gray-100">Выберите праздник</h1>
				<p class="text-gray-400 text-sm">Для создания персональной открытки</p>
			</div>
		</div>

		<div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
			<div
				v-for="card in cards"
				:key="card.id"
				@click="selectHoliday(card)"
				class="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-700 transition-colors"
			>
				<div
					class="aspect-square bg-gray-600 rounded-lg mb-3 flex items-center justify-center text-4xl"
				>
					<!-- Заглушка изображения -->
					{{ card.icon || '🎉' }}
				</div>
				<h3 class="text-white font-medium text-center">{{ card.title }}</h3>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import cards from '@/data/cards'

const router = useRouter()

function goBack() {
	router.go(-1)
}

function selectHoliday(card) {
	router.push({ name: 'editor', query: { holiday: card.id } })
}
</script>
