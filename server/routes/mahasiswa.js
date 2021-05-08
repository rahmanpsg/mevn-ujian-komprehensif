const express = require('express')
const User = require('../models/User')
const router = express.Router()

// ambil semua data mahasiswa
router.get('/', async (req, res) => {
    const mahasiswas = await User.find({ role: 'mahasiswa' }).sort('nim')

    res.send(mahasiswas)
})

// tambah data mahasiswa
router.post('/', async (req, res) => {
    const { nim, nama, username, password, images, penguji } = req.body

    const mahasiswa = new User({
        nim,
        nama,
        username,
        password,
        images,
        penguji,
        role: 'mahasiswa'
    })

    mahasiswa.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Mahasiswa berhasil disimpan',
            id: doc._id
        })
    })
})

// ubah data mahasiswa
router.put('/', async (req, res) => {
    const { _id, nim, nama, username, password, images, penguji } = req.body

    const newData = { nim, nama, username, password, images, penguji }

    User.findByIdAndUpdate(_id, newData, { useFindAndModify: false }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Mahasiswa berhasil diubah'
        });
    });
})

// hapus data mahasiswa
router.delete('/:id', async (req, res) => {
    const _id = req.params.id

    if (!_id) {
        return res.status(404).send({ message: 'ID tidak ditemukan' })
    }

    User.deleteOne({ _id }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Mahasiswa berhasil dihapus'
        });
    });
})

module.exports = router