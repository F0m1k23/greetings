<template>
	<div class="card bg-base-100 shadow-xl">
		<figure>
			<img :src="src" :alt="alt" class="w-full h-48 object-cover" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">{{ title }}</h2>
			<div class="card-actions justify-end">
				<button class="btn btn-primary">Select</button>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	src: String,
	alt: String,
	title: String,
})
</script>

<style scoped></style>
