const express = require('express')
const request = require('request')
require ('dotenv').config()

const app = express()
const baseGoogleUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='
const endGoogleUrl = `&inputtype=textquery&fields=geometry&key=${process.env.GOOGLE_KEY}`
const baseSongkickMetroUrl = `https://api.songkick.com/api/3.0/search/locations.json?location=geo:`
const endSongkickMetroUrl = `&apikey=${process.env.SONGKICK_KEY}`
const baseSongkickEventsUrl = `https://api.songkick.com/api/3.0/metro_areas/`
const exampleSongkickEventRequest = `https://api.songkick.com/api/3.0/metro_areas/6404/calendar.json?min_date=2020-03-15&apikey=${process.env.SONGKICK_KEY}`



const createSearchParameter = (input) => {
    return input.split(' ').join('+')
}

const combineAllUrls = (q) => {
    return baseGoogleUrl + createSearchParameter(q) + endGoogleUrl
}

app.get('/searchAddress', (req, res) => {
    console.log(combineAllUrls(req.query.q))
    request({url: combineAllUrls(req.query.q), json: true}, (err, response) => {
        if (response.body.status == "OK") {
            res.send(response.body.candidates[0].geometry.location)
        } else {
            res.send({error: 'Sorry, that isnt a valid location.'})
        }
    })
})

const songkickMetroUrl = (location) => {
    return baseSongkickMetroUrl + location + endSongkickMetroUrl
}

const songkickEventUrl = () => {

}

app.get(`/getMetro`, (req, res) => {
    request({url: songkickMetroUrl(req.query.location), json: true}, (err, response) => {
        const metroId = response.body.resultsPage.results.location[0].metroArea.id
        console.log(metroId)

    })
})


app.listen(3001, () => console.log('listening on 3001'))