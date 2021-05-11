const mongoose = require('mongoose')

const schema = mongoose.Schema({
    mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    jawaban: [
        {
            'soal': {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Soal"
            },
            'jawab': String
        }
    ],
    waktuMulai: Date,
    waktuSelesai: Date,
    nilai: Number
})

module.exports = mongoose.model('Hasil', schema)