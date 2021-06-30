const mongoose = require('mongoose')

const schema = mongoose.Schema({
    matakuliah: String,
})

module.exports = mongoose.model('Matakuliah', schema)