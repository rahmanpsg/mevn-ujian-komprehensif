const mongoose = require('mongoose')

const schema = mongoose.Schema({
    no: Number,
    pertanyaan: String,
    jawaban: Object,
    benar: String,
    matakuliah: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Matakuliah"
    }
})

module.exports = mongoose.model('Soal', schema)