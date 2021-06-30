const mongoose = require('mongoose')

const schema = mongoose.Schema({
    nim: Number,
    username: String,
    password: String,
    nama: String,
    images: Array,
    role: String,
    hasil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hasil"
    }
})

module.exports = mongoose.model('User', schema)