const express = require('express')
const axios = require('axios')
const crypto = require('crypto')
const app = express()
const PORT = process.env.PORT || 3000 // Use Vercel's default port

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const SEKRET = 'R0M0U3B4NGpYaUtpWEgxb2pYblJpelZlRUlpTlRYV0x6eGpNT0tBSjd0az0,'
const HASLO_Z_USTAWIEN = 'kj912hAHJsdg129dy123hjdai7123'
const RETURN_URL_SUCCESS = 'https://yourdomain.com/success' // Replace with your success URL
const RETURN_URL_FAILURE = 'https://yourdomain.com/failure' // Replace with your failure URL

// API Endpoint to handle payment initiation
app.post('/api/pay', (req, res) => {
	const { amount } = req.body
	const nazwa_uslugi = 'Zakup towaru'
	const id_zamowienia = 'order-' + Date.now()

	// Generate HASH using SHA-256
	const hash = crypto
		.createHash('sha256')
		.update(`${HASLO_Z_USTAWIEN};${amount};${nazwa_uslugi};${RETURN_URL_SUCCESS};${id_zamowienia};${SEKRET}`)
		.digest('hex')

	// Construct the HotPay payment URL
	const hotpayUrl = `https://platnosc.hotpay.pl/?SEKRET=${SEKRET}&KWOTA=${amount}&NAZWA_USLUGI=${nazwa_uslugi}&ADRES_WWW=${RETURN_URL_SUCCESS}&ID_ZAMOWIENIA=${id_zamowienia}&HASH=${hash}`

	// Send the HotPay URL back to the client
	res.json({ url: hotpayUrl })
})

// API Endpoint to handle HotPay notifications
app.post('/api/hotpay-notification', (req, res) => {
	const { KWOTA, STATUS, ID_ZAMOWIENIA, ID_PLATNOSCI, SECURE, HASH } = req.body

	// Recalculate the HASH to verify the request's authenticity
	const calculatedHash = crypto
		.createHash('sha256')
		.update(`${HASLO_Z_USTAWIEN};${KWOTA};${ID_PLATNOSCI};${ID_ZAMOWIENIA};${STATUS};${SECURE};${SEKRET}`)
		.digest('hex')

	if (HASH === calculatedHash && SEKRET === 'R0M0U3B4NGpYaUtpWEgxb2pYblJpelZlRUlpTlRYV0x6eGpNT0tBSjd0az0,') {
		if (STATUS === 'SUCCESS') {
			console.log(`Payment successful for order ${ID_ZAMOWIENIA}`)
			res.redirect(RETURN_URL_SUCCESS) // Redirect to success page
		} else {
			console.log(`Payment failed for order ${ID_ZAMOWIENIA}`)
			res.redirect(RETURN_URL_FAILURE) // Redirect to failure page
		}
	} else {
		console.log('Invalid notification')
		res.status(400).send('Invalid notification')
	}
})

module.exports = app
