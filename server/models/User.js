const mongoose = require('mongoose')

const schema = mongoose.Schema({
    nim: Number,
    nbm: Number,
    username: String,
    password: String,
    nama: String,
    images: Array,
    role: String,
    penguji: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('User', schema)