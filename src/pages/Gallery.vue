<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<div class="max-w-md mx-auto">
			<h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
				🖼 Выберите открытку
			</h2>

			<div class="grid grid-cols-2 gap-4">
				<div
					v-for="item in images"
					:key="item.id"
					@click="open(item.id)"
					class="aspect-[3/4] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
				>
					<img
						:src="item.image"
						alt="Открытка"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { templates } from '@/data/templates'

const route = useRoute()
const router = useRouter()

const holiday = route.params.holiday
const images = templates[holiday] || []

const open = id => {
	router.push(`/preview/${holiday}/${id}`)
}
</script>
