const express = require('express')
const Matakuliah = require('../models/Matakuliah')
const User = require('../models/Matakuliah')
const router = express.Router()

// ambil semua data matakuliah
router.get('/', async (req, res) => {
    const matakuliahs = await Matakuliah.find()

    res.send(matakuliahs)
})

// tambah data matakuliah
router.post('/', async (req, res) => {
    const { matakuliah } = req.body

    const matakuliahs = new User({
        matakuliah,
        role: 'matakuliah'
    })

    matakuliahs.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Matakuliah berhasil disimpan',
            id: doc._id
        })
    })
})

// ubah data matakuliah
router.put('/', async (req, res) => {
    const { _id, matakuliah } = req.body

    const newData = { matakuliah }

    Matakuliah.findByIdAndUpdate(_id, newData, { useFindAndModify: false }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Matakuliah berhasil diubah'
        });
    });
})

// hapus data matakuliah
router.delete('/:id', async (req, res) => {
    const _id = req.params.id

    if (!_id) {
        return res.status(404).send({ message: 'ID tidak ditemukan' })
    }

    Matakuliah.deleteOne({ _id }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Matakuliah berhasil dihapus'
        });
    });
})

module.exports = router