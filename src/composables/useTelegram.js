export function useTelegram() {
	const tg = window.Telegram.WebApp

	const sendGreeting = ({ imageUrl, caption }) => {
		tg.sendData(
			JSON.stringify({
				type: 'send_greeting',
				imageUrl,
				caption,
			})
		)
	}

	return {
		tg,
		sendGreeting,
	}
}
