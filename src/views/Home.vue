<template>
	<div class="page space-y-5">
		<div class="space-y-1">
			<h1 class="page-title">Открытки</h1>
			<p class="muted text-sm">
				Выберите категорию и добавляйте картинки в избранное
			</p>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
			<PostCard
				v-for="card in cards"
				:key="card.id"
				:card="card"
				@select="openGallery"
			/>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import cards from '../data/cards'

const router = useRouter()

function openGallery(card) {
	router.push({ name: 'gallery', params: { id: card.id } })
}
</script>
