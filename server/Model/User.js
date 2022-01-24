const mongoose = require('mongoose')
const { Schema } = require('mongoose')


const collection = 'UserData'

// Schema
const schema = new Schema({  
    name: {
      type: String
    },

    // email: {
    //   type: String,
    //   trim: true,
    // },

    mobile: {
      type: Number,
      required: true,      
    },

    OTP: {
      type: Number,
      required: true,
    },

    // password: {
    //   type: String,
    //   required: false,
    // },

    image: {
      type: String,      
    },

    role: {
      type: String,      
    },

    age: {
      type: String
    },

    gender: {
      type: String
    },

    cabCurrentCoordinate: {
      type: Object
    },

    DL: {
      type: String,
    },

    vehicleReg: {
      type: String,
    },

    insuranceExpireDate: {
      type: Number,
    },

    pollutionExpireDate: {
      type: Number,
    },

    isAvailableForRide: {
      type: Boolean,
    }

}, {timestamps: true})

// Model
module.exports = mongoose.model(collection, schema, collection)