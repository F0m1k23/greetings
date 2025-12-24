// composables/useGreetingCanvas.js
import { ref } from 'vue'

export function useGreetingCanvas(canvasRef, width = 1080, height = 1350) {
	const isLoading = ref(false)
	const error = ref('')

	// Загрузка изображения
	const loadImage = src => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.onload = () => resolve(img)
			img.onerror = () => {
				// При ошибке загрузки используем placeholder
				const placeholder = new Image()
				placeholder.src =
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIxMDAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+'
				placeholder.onload = () => resolve(placeholder)
				placeholder.onerror = reject
			}
			img.src = src
		})
	}

	// Расчет размеров текста
	const calculateTextDimensions = (ctx, text, fontSize, maxWidth) => {
		ctx.font = `400 ${fontSize}px Arial`
		const words = text.split(' ')
		const lines = []
		let currentLine = words[0]

		for (let i = 1; i < words.length; i++) {
			const word = words[i]
			const testLine = currentLine + ' ' + word
			const metrics = ctx.measureText(testLine)

			if (metrics.width > maxWidth) {
				lines.push(currentLine)
				currentLine = word
			} else {
				currentLine = testLine
			}
		}
		lines.push(currentLine)

		// Вычисляем общую высоту текста
		const lineHeight = fontSize * 1.2
		const totalHeight = lines.length * lineHeight

		// Вычисляем максимальную ширину строки
		let maxLineWidth = 0
		lines.forEach(line => {
			const width = ctx.measureText(line).width
			if (width > maxLineWidth) maxLineWidth = width
		})

		return { lines, lineHeight, totalHeight, maxLineWidth }
	}

	// Основная функция отрисовки
	const draw = async options => {
		if (!canvasRef.value) return

		const ctx = canvasRef.value.getContext('2d')
		if (!ctx) return

		const {
			imageSrc,
			text,
			textStyle,
			frame,
			fontSize = 40,
			textPosition = 'bottom',
			textPadding = 60,
			textFrame = 'none',
		} = options

		isLoading.value = true
		error.value = ''

		try {
			// Очистка канваса
			ctx.clearRect(0, 0, width, height)

			// Загрузка и отрисовка изображения
			const image = await loadImage(imageSrc)
			ctx.drawImage(image, 0, 0, width, height)

			// Применение рамки изображения
			if (frame && frame.draw) {
				frame.draw(ctx, width, height)
			}

			// Отображение текста
			if (text && text.trim()) {
				// Временная установка шрифта для расчета размеров
				ctx.font = textStyle.font(fontSize)
				ctx.fillStyle = textStyle.color
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'

				// Расчет размеров текста
				const maxTextWidth = width - textPadding * 2
				const { lines, lineHeight, totalHeight, maxLineWidth } =
					calculateTextDimensions(ctx, text, fontSize, maxTextWidth)

				// Расчет позиции текста
				let yPos
				switch (textPosition) {
					case 'top':
						yPos = textPadding + totalHeight / 2
						break
					case 'middle':
						yPos = height / 2
						break
					case 'bottom':
					default:
						yPos = height - textPadding - totalHeight / 2
						break
				}

				// Применение рамки текста (если выбрана)
				if (textFrame !== 'none' && textFrameStyles) {
					const textFrameStyle = textFrameStyles[textFrame]
					if (textFrameStyle && textFrameStyle.draw) {
						textFrameStyle.draw(
							ctx,
							text,
							width / 2,
							yPos,
							maxLineWidth + 40, // увеличить ширину для рамки
							totalHeight + 40 // увеличить высоту для рамки
						)
					}
				}

				// Настройка шрифта для отрисовки
				ctx.font = textStyle.font(fontSize)
				ctx.fillStyle = textStyle.color
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'

				// Применение обводки текста (если включена)
				if (textStyle.outline) {
					ctx.strokeStyle = '#000000'
					ctx.lineWidth = Math.max(2, fontSize / 20)
					ctx.lineJoin = 'round'
				}

				// Применение тени текста
				if (textStyle.shadow) {
					if (Array.isArray(textStyle.shadow)) {
						// Для множественных теней отрисовываем текст несколько раз
						textStyle.shadow.forEach((shadow, index) => {
							ctx.save()
							ctx.shadowColor = shadow.color
							ctx.shadowBlur = shadow.blur || 0
							ctx.shadowOffsetX = shadow.x || 0
							ctx.shadowOffsetY = shadow.y || 0

							lines.forEach((line, lineIndex) => {
								const lineY =
									yPos -
									totalHeight / 2 +
									lineHeight / 2 +
									lineIndex * lineHeight
								if (textStyle.outline) ctx.strokeText(line, width / 2, lineY)
								ctx.fillText(line, width / 2, lineY)
							})

							ctx.restore()
						})
					} else {
						// Одиночная тень
						ctx.shadowColor = textStyle.shadow.color
						ctx.shadowBlur = textStyle.shadow.blur || 0
						ctx.shadowOffsetX = textStyle.shadow.x || 0
						ctx.shadowOffsetY = textStyle.shadow.y || 0
					}
				}

				// Отрисовка текста
				lines.forEach((line, index) => {
					const lineY =
						yPos - totalHeight / 2 + lineHeight / 2 + index * lineHeight
					if (textStyle.outline) ctx.strokeText(line, width / 2, lineY)
					ctx.fillText(line, width / 2, lineY)
				})

				// Сброс тени
				ctx.shadowColor = 'transparent'
				ctx.shadowBlur = 0
				ctx.shadowOffsetX = 0
				ctx.shadowOffsetY = 0

				// Добавление водяного знака (если нужно)
				ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
				ctx.font = '16px Arial'
				ctx.textAlign = 'right'
				ctx.textBaseline = 'bottom'
				ctx.fillText('GreetingCard Pro', width - 20, height - 20)
			}
		} catch (err) {
			console.error('Ошибка отрисовки:', err)
			error.value = 'Ошибка при создании открытки'
		} finally {
			isLoading.value = false
		}
	}

	// Экспорт в Blob
	const toBlob = (quality = 0.92) => {
		return new Promise(resolve => {
			if (!canvasRef.value) {
				resolve(null)
				return
			}

			canvasRef.value.toBlob(blob => resolve(blob), 'image/png', quality)
		})
	}

	// Экспорт в Data URL
	const toDataURL = () => {
		return canvasRef.value ? canvasRef.value.toDataURL('image/png') : ''
	}

	// Стили рамок для текста (должны быть импортированы или определены здесь)
	const textFrameStyles = {
		none: {
			label: 'Без рамки текста',
			draw: () => {},
			icon: '🚫',
		},
		glass: {
			label: 'Стеклянная рамка',
			draw(ctx, text, x, y, width, height) {
				ctx.save()

				// Стеклянный эффект
				ctx.beginPath()
				ctx.roundRect(
					x - width / 2 - 20,
					y - height / 2 - 20,
					width + 40,
					height + 40,
					20
				)
				ctx.clip()

				// Размытый фон
				ctx.filter = 'blur(10px)'
				ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
				ctx.fillRect(
					x - width / 2 - 20,
					y - height / 2 - 20,
					width + 40,
					height + 40
				)
				ctx.filter = 'none'

				// Основная стеклянная панель
				const gradient = ctx.createLinearGradient(
					x - width / 2 - 10,
					y - height / 2 - 10,
					x - width / 2 - 10,
					y + height / 2 + 10
				)
				gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
				gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)')
				gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)')

				ctx.fillStyle = gradient
				ctx.beginPath()
				ctx.roundRect(
					x - width / 2 - 10,
					y - height / 2 - 10,
					width + 20,
					height + 20,
					20
				)
				ctx.fill()

				// Световая полоса сверху
				ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
				ctx.beginPath()
				ctx.roundRect(
					x - width / 2 - 10,
					y - height / 2 - 10,
					width + 20,
					4,
					[20, 20, 0, 0]
				)
				ctx.fill()

				// Обводка
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.roundRect(
					x - width / 2 - 10,
					y - height / 2 - 10,
					width + 20,
					height + 20,
					20
				)
				ctx.stroke()

				ctx.restore()
			},
			icon: '🔮',
		},
	}

	return {
		draw,
		toBlob,
		toDataURL,
		isLoading,
		error,
	}
}
