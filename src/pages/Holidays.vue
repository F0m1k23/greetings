<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<div class="max-w-md mx-auto">
			<h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
				🎉 Выберите праздник
			</h2>

			<div class="grid grid-cols-2 gap-4">
				<div
					v-for="holiday in holidays"
					:key="holiday.id"
					@click="openHoliday(holiday.id)"
					class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
				>
					<div class="aspect-square bg-gray-100">
						<img
							:src="holiday.cover"
							alt=""
							class="w-full h-full object-cover"
						/>
					</div>
					<div class="p-4 text-center">
						<span class="text-2xl mb-2 block">{{ holiday.emoji }}</span>
						<h3 class="font-medium text-base text-gray-800">
							{{ holiday.title }}
						</h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { holidays } from '@/data/holidays'
import { useRouter } from 'vue-router'

const router = useRouter()
const openHoliday = id => {
	router.push(`/gallery/${id}`)
}
</script>
