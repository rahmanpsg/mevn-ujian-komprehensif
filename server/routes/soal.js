const express = require('express')
const Soal = require('../models/Soal')
const router = express.Router()

// ambil semua data soal
router.get('/', async (req, res) => {
    const soals = await Soal.find().sort('no')

    res.send(soals)
})

// ambil semua data soal berdasarkan penguji
router.get('/:penguji', async (req, res) => {
    const penguji = req.params.penguji

    const soals = await Soal.find({ penguji }).sort('no')

    res.send(soals)
})

// tambah data soal
router.post('/', async (req, res) => {
    const { no, pertanyaan, jawaban, benar, penguji } = req.body

    const soal = new Soal({
        no,
        pertanyaan,
        jawaban,
        benar,
        penguji
    })

    soal.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Soal berhasil disimpan',
            id: doc._id
        })
    })
})

// ubah data soal
router.put('/', async (req, res) => {
    const { _id, no, pertanyaan, jawaban, benar, penguji } = req.body

    const newData = { no, pertanyaan, jawaban, benar, penguji }

    Soal.findByIdAndUpdate(_id, newData, { useFindAndModify: false }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Soal berhasil diubah'
        });
    });
})

// hapus data soal
router.delete('/:id', async (req, res) => {
    const _id = req.params.id

    if (!_id) {
        return res.status(404).send({ message: 'ID tidak ditemukan' })
    }

    Soal.deleteOne({ _id }, err => {
        if (err) return res.status(500).send({ message: err });

        res.status(200).send({
            message: 'Soal berhasil dihapus'
        });
    });
})

module.exports = router