const express = require('express')
const User = require('../models/User')
const router = express.Router()

// ambil semua data penguji
router.get('/', async (req, res) => {
    if (req.query.select == 'nama') {
        const pengujis = await User.find({ role: 'penguji' }).select(['nama'])

        return res.send(pengujis)
    }
    const pengujis = await User.find({ role: 'penguji' }).sort('nama')

    res.send(pengujis)
})

// tambah data penguji
router.post('/', async (req, res) => {
    const { nbm, nama, username, password, images } = req.body

    const penguji = new User({
        nbm,
        nama,
        username,
        password,
        images,
        role: 'penguji'
    })

    penguji.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Penguji berhasil disimpan',
            id: doc._id
        })
    })
})

// ubah data penguji
router.put('/', async (req, res) => {
    const { _id, nbm, nama, username, password, images } = req.body

    const newData = { nbm, nama, username, password, images }

    User.findByIdAndUpdate(_id, newData, { useFindAndModify: false }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Penguji berhasil diubah'
        });
    });
})

// hapus data penguji
router.delete('/:id', async (req, res) => {
    const _id = req.params.id

    if (!_id) {
        return res.status(404).send({ message: 'ID tidak ditemukan' })
    }

    User.deleteOne({ _id }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Penguji berhasil dihapus'
        });
    });
})

module.exports = router