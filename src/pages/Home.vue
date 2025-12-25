<template>
	<div class="min-h-screen bg-gray-50 flex flex-col">
		<!-- Основной контент -->
		<main class="flex-1 flex flex-col items-center justify-center p-6">
			<div
				class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
			>
				<h1 class="text-3xl font-bold text-gray-800 mb-2">🎁 Открытки</h1>
				<p class="text-gray-600 mb-8">Быстро и красиво поздравьте близких</p>

				<div class="space-y-4">
					<button
						@click="go('/holidays')"
						class="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					>
						🎉 Выбрать готовую открытку
					</button>

					<button
						@click="go('/editor')"
						class="w-full py-4 px-6 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					>
						✍️ Создать открытку
					</button>
				</div>
			</div>
		</main>

		<!-- Подвал -->
		<footer class="p-6 text-center">
			<p class="text-sm text-gray-500">Без регистрации · Просто · Для всех</p>
		</footer>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const go = path => router.push(path)
</script>
