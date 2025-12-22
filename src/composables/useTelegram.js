export function useTelegram() {
	const tg = window.Telegram.WebApp

	const sendGreeting = ({
		imageUrl,
		caption,
		textStyle = 'white',
		fontStyle = 'bold',
	}) => {
		tg.sendData(
			JSON.stringify({
				type: 'send_greeting',
				imageUrl,
				caption,
				textStyle,
				fontStyle,
			})
		)
	}

	return {
		tg,
		sendGreeting,
	}
}
