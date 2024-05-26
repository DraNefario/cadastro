const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Insira seu nome."]
        },
        email: {
            type: String,
            required: [true, "Insira seu telefone."]
        },
        phone: {
            type: String,
            required: [false]
        },
        password: {
            type: String,
            required: [true, "Insira sua senha."]
        }
    }, {
        timestamp: true
    }
)

const User = mongoose.models.Users || mongoose.model('Users', UsersSchema)

module.exports = User