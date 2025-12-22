<template>
	<div class="min-h-screen bg-white p-6 pb-24 flex flex-col">
		<!-- Hero Section -->
		<div class="mb-12 mt-4">
			<h1 class="text-4xl font-bold text-gray-900 mb-3">Волшебные открытки</h1>
			<p class="text-gray-600 text-lg">Подберём открытку за пару секунд</p>
		</div>

		<!-- Holidays grid -->
		<div class="grid grid-cols-2 gap-5">
			<div
				v-for="holiday in holidays"
				:key="holiday.id"
				@click="goToGallery(holiday)"
				class="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-95"
			>
				<!-- Gradient background -->
				<div
					class="absolute inset-0"
					:style="{ background: holiday.gradient }"
				></div>

				<!-- Content -->
				<div
					class="relative p-8 flex flex-col items-center justify-center min-h-48 z-10"
				>
					<!-- Icon with animation -->
					<component
						:is="holiday.icon"
						:class="[
							'w-16 h-16 mb-4 transition-all duration-300',
							'group-hover:scale-110 group-hover:rotate-12',
						]"
						:style="{ color: holiday.iconColor }"
					/>

					<!-- Title -->
					<div class="text-center">
						<div class="text-xl font-bold text-white mb-2">
							{{ holiday.title }}
						</div>
						<div class="text-sm text-white/80 font-medium">
							{{ holiday.count }} открыток
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

// Heroicons
import {
	GiftIcon,
	CakeIcon,
	SparklesIcon,
	CalendarDaysIcon,
	HeartIcon,
} from '@heroicons/vue/24/outline'

import { images } from '../data/images'

const router = useRouter()

// Подсчет картинок по категориям
const getImageCount = holidayId => {
	return images.filter(img => img.holiday === holidayId).length
}

const holidays = [
	{
		id: 'new-year',
		title: 'Новый год',
		icon: GiftIcon,
		gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
		iconColor: '#fef3c7',
		count: 0, // будет вычислено ниже
	},
	{
		id: 'birthday',
		title: 'День рождения',
		icon: CakeIcon,
		gradient: 'linear-gradient(135deg, #be123c 0%, #ec4899 100%)',
		iconColor: '#fef3c7',
		count: 0,
	},
	{
		id: 'march-8',
		title: '8 марта',
		icon: SparklesIcon,
		gradient: 'linear-gradient(135deg, #d946a6 0%, #f97316 100%)',
		iconColor: '#fef3c7',
		count: 0,
	},
	{
		id: 'easter',
		title: 'Пасха',
		icon: CalendarDaysIcon,
		gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
		iconColor: '#fef3c7',
		count: 0,
	},
	{
		id: 'universal',
		title: 'Универсальные',
		icon: HeartIcon,
		gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
		iconColor: '#fce7f3',
		count: 0,
	},
]

// Вычисляем количество картинок для каждого праздника
holidays.forEach(holiday => {
	holiday.count = getImageCount(holiday.id)
})

const goToGallery = holiday => {
	router.push({
		path: '/gallery',
		query: {
			holiday: holiday.id,
		},
	})
}
</script>
