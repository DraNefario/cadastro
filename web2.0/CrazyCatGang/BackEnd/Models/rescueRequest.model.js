const mongoose = require('mongoose')

const RescueRequestSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [false]
        },
        email: {
            type: String,
            required: [false]
        },
        phone: {
            type: String,
            required: [false]
        },
        address: {
            type: String,
            required: [true, "Insira um endereço para resgate."]
        },
        catCharacteristics: {
            type: String,
            required: [false]
        },
        observations: {
            type: String,
            required: [false]
        }
    }, {
        timestamp: true
    }
)


const RescueRequest = mongoose.models.RescueRequest || mongoose.model('RescueRequests', RescueRequestSchema)

module.exports = RescueRequest