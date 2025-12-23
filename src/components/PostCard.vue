<template>
	<div
		class="card category-card cursor-pointer transition-transform active:scale-95"
		@click="$emit('select', card)"
	>
		<div class="flex flex-col items-center justify-center h-48 space-y-4">
			<div class="category-icon">
				<span class="text-xl">✦</span>
			</div>

			<h3 class="category-title text-center">
				{{ card.title }}
			</h3>
		</div>
	</div>
</template>

<script setup>
defineProps({
	card: {
		type: Object,
		required: true,
	},
})

defineEmits(['select'])
</script>
