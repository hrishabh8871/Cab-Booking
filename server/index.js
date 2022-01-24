// Libraries, App Imports
const http = require('http');
const express = require('express');
// const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { NODE_ENV, PORT, MONGODBURL } = require('./Config/config')
const mongoUrl = MONGODBURL
const path = require('path')
const router = require('./Routes/routers');
const app = express();
const server = http.createServer(app);
// const io = socketio(server);
var io = require('socket.io')
const Pusher = require('pusher')

// app config
app.use(express.urlencoded({
    extended: true
}))

app.use(cors());

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")
    next();
});

const pusher = new Pusher({
    appId: "1337047",
    key: "306f809ac5ff99a6198a",
    secret: "adef2631af5ceef26fbb",
    cluster: "ap2",
    useTLS: true
  });

app.use('/', express.static(path.join(__dirname, '/public')));

// CROSS ORIGIN
app.use(cors());

app.listen(PORT || 5001, () => {
    console.warn(`Server has started on port ${process.env.PORT || 5001}`)
    console.warn(`Server has started ${new Date()}`)
    console.warn(`Server env ${NODE_ENV}`)
});




// Routers
app.use(router);

const connectDb = () => {
    try {
        mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log("Mongo db connected")
        });
    }
    catch (error) {
        console.log("could not connect, Please wait conection retrying...");
    }
}

connectDb();

const db = mongoose.connection

db.once('open', () => {
    console.log('DB is CONNECTED')
    const userRides = db.collection('UserRides')
    const changeStream = userRides.watch()

    changeStream.on('change', (change) => {
        // console.log(change);
        if(change.operationType === 'insert') {
            const ridesDeatils = change.fullDocument;
            pusher.trigger('newRideData', 'inserted',
            ridesDeatils
            )
        } else {
            console.log("ERROR TRIGGERING PUSHER")
        }
    })
})