const express = require('express')
const request = require('request')
require ('dotenv').config()

const app = express()
const baseGoogleUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='
const endGoogleUrl = `&inputtype=textquery&fields=geometry&key=${process.env.GOOGLE_KEY}`


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
            res.send({error: 'Sorry, that isnt a valid'})
        }
    })
})


app.listen(3001, () => console.log('listening on 3001'))