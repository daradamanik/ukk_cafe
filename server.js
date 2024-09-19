const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())
app.use(express.static(__dirname))

const userRoute = require('./routes/user-routes')
app.use(`/user`, userRoute)
const menuRoute = require('./routes/menu-routes')
app.use(`/menu`, menuRoute)
const mejaRoute = require('./routes/meja-routes')
app.use(`/meja`, mejaRoute)

app.listen(8000, () => {
    console.log("running")
})