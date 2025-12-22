<template>
	<div class="p-4 pb-20">
		<!-- Title -->
		<h1 class="text-xl font-semibold mb-1">Выберите повод</h1>

		<p class="text-sm text-gray-500 mb-4">Подберём открытку за пару секунд</p>

		<!-- Holidays grid -->
		<div class="grid grid-cols-2 gap-4">
			<div
				v-for="holiday in holidays"
				:key="holiday.id"
				@click="goToGallery(holiday)"
				class="group card p-4 flex flex-col items-center justify-center active:scale-95 cursor-pointer soft-transition transition-colors transition-transform duration-150 ease-in-out hover:shadow-lg"
			>
				<!-- Icon -->
				<component
					:is="holiday.icon"
					class="w-8 h-8 mb-2 text-gray-700 transition-transform duration-150 group-hover:scale-110"
				/>

				<!-- Title -->
				<div class="text-sm font-medium text-center">
					{{ holiday.title }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Lucide icons
import { Gift, Cake, Flower2, Egg, Sparkles } from 'lucide-vue-next'

const router = useRouter()

const holidays = [
	{
		id: 'new-year',
		title: 'Новый год',
		icon: Gift,
	},
	{
		id: 'birthday',
		title: 'День рождения',
		icon: Cake,
	},
	{
		id: 'march-8',
		title: '8 марта',
		icon: Flower2,
	},
	{
		id: 'easter',
		title: 'Пасха',
		icon: Egg,
	},
	{
		id: 'universal',
		title: 'Универсальные',
		icon: Sparkles,
	},
]

const goToGallery = holiday => {
	router.push({
		path: '/gallery',
		query: {
			holiday: holiday.id,
		},
	})
}
</script>
<style scoped></style>
