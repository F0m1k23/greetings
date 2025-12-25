<template>
	<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
		<div class="card-body">
			<h2 class="card-title">{{ title }}</h2>
			<p>{{ description }}</p>
			<div class="card-actions justify-end">
				<button class="btn btn-primary">Select</button>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: String,
	description: String,
})
</script>

<style scoped></style>
