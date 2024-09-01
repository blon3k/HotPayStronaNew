import React from 'react'
import axios from 'axios'

const PaymentButtons = () => {
	const handlePayment = async amount => {
		try {
			// Call the backend to get the payment URL
			const response = await axios.post('https://hot-pay-strona-new.vercel.app/pay', { amount })
			const { url } = response.data

			// Redirect to the HotPay payment URL
			window.location.href = url
		} catch (error) {
			console.error('Error initiating payment', error.message)
		}
	}

	return (
		<div>
			<button onClick={() => handlePayment(24.99)}>Zapłać 24.99</button>
			<button onClick={() => handlePayment(37.99)}>Zapłać 37.99</button>
			<button onClick={() => handlePayment(79.99)}>Zapłać 79.99</button>
		</div>
	)
}

export default PaymentButtons
