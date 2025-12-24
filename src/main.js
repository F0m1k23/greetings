import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'

if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
	CanvasRenderingContext2D.prototype.roundRect = function (
		x,
		y,
		width,
		height,
		radius
	) {
		if (typeof radius === 'number') {
			radius = { tl: radius, tr: radius, br: radius, bl: radius }
		} else if (Array.isArray(radius)) {
			radius = { tl: radius[0], tr: radius[1], br: radius[2], bl: radius[3] }
		} else {
			radius = { tl: 0, tr: 0, br: 0, bl: 0 }
		}

		this.beginPath()
		this.moveTo(x + radius.tl, y)
		this.lineTo(x + width - radius.tr, y)
		this.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
		this.lineTo(x + width, y + height - radius.br)
		this.quadraticCurveTo(
			x + width,
			y + height,
			x + width - radius.br,
			y + height
		)
		this.lineTo(x + radius.bl, y + height)
		this.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
		this.lineTo(x, y + radius.tl)
		this.quadraticCurveTo(x, y, x + radius.tl, y)
		this.closePath()
		return this
	}
}

// Initialize Telegram WebApp
if (window.Telegram?.WebApp) {
	window.Telegram.WebApp.ready()
	window.Telegram.WebApp.expand()
}

createApp(App).use(router).mount('#app')
