const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express()

const myName = 'Matt'
const uiURL = process.env.FRONTEND_URL || 'http://localhost:3000/'
const port = process.env.PORT || 8080
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_url = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8080/callback'

app.get('/', (req, res) => {
    res.send('yo')
})

app.get('/login', (req, res) => {
    console.log('Getting /login')
    const scopes = 'user-read-private user-read-email'
    res.redirect('https://accounts.spotify.com/authorize' + 
        '?response_type=code' + 
        '&client_id=' + spotify_client_id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_url)
    )
})

app.get('/callback', (req, res) => {
    console.log('Callback from login...')
    const authCode = req.query.code || null
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirect_url
        },
        headers: {
            Authorization: 'Basic ' + 
                ( new Buffer(spotify_client_id + ':' + spotify_client_secret)
                .toString('base64'))
        },
        json: true
    }
    console.log('Auth Options', JSON.stringify(authOptions, '', 2))
    console.log('Getting access token... ')
    request.post(authOptions, (error, response, body) => {
        let access_token = body.access_token
        console.log('Access token:', access_token)
        let url = uiURL
        res.redirect(url + '?access_token=' + access_token)
    })
})

console.log('Server listening on port', port)
console.log('Go to /login to initialize the Spotify authentication.')
app.listen(port)

module.exports = {
    myName,
    port,
    redirect_url
}