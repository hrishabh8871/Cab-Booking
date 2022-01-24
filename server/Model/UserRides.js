const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const User = require('./User')


const collection = 'UserRides'

// Schema
const schema = new Schema({

    userID: {
        type: Schema.Types.ObjectId,
        ref: User
    },

    cabDriverID: {
        type: Schema.Types.ObjectId,
        ref: User
    },

    duration: {
      type: Number
    },

    status: {
        type: String //Two Type InProgress & Complete & Cancel
    },

    pickupCoordinate: {
      type: Array,      
    },

    dropCoordinate: {
      type: Array,      
    },

    totalPrice: {
        type: Number
    },

    isPeekHrs: {
        type: Boolean
    },

    pickedUpStamp: {
        type: Number
    },

    dropTimestamp: {
        type: Number
    },

    OTPVerificiation: {
        type: Number
    },

    isCancelledBy: {
        type: Object
    }


}, {timestamps: true})

// Model
module.exports = mongoose.model(collection, schema, collection)