const mongoose = require('mongoose')

const schema = mongoose.Schema({
    no: Number,
    pertanyaan: String,
    jawaban: Object,
    benar: String,
    penguji: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Soal', schema)