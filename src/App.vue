<script setup>
import { onMounted } from 'vue'
import { useTelegram } from './composables/useTelegram'

const { init } = useTelegram()

onMounted(() => {
	init()
})
</script>

<template>
	<router-view></router-view>
</template>

<style scoped></style>
