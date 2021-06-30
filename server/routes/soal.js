const express = require('express')
const Soal = require('../models/Soal')
const router = express.Router()
const itemRouter = express.Router({ mergeParams: true });

// ambil semua data soal
router.get('/', async (req, res) => {
    const soals = await Soal.find().populate('matakuliah').sort('matakuliah')

    res.send(soals)
})

// ambil semua data soal berdasarkan matakuliah
router.get('/:matakuliah', async (req, res) => {
    const matakuliah = req.params.matakuliah

    const soals = await Soal.find({ matakuliah }).select('-matakuliah')

    res.send(soals)
})

router.use('/:mahasiswa/ujian', itemRouter);

// ambil data soal random untuk ujian
itemRouter.get('/', async (req, res) => {
    // const mahasiswa = req.params.mahasiswa

    const soals = await Soal.find().select('-benar').populate('matakuliah')

    // Total soal yang akan ditampilkan
    const totalSoal = 50;

    // const listTotalSoalMatakuliah = {};
    const listSoalByMatakuliah = {}
    soals.forEach(v => {
        // group data soal by matakuliah
        listSoalByMatakuliah[v.matakuliah.matakuliah] = listSoalByMatakuliah[v.matakuliah.matakuliah] ? [...listSoalByMatakuliah[v.matakuliah.matakuliah], v] : [v]
    })

    const newListSoal = []

    // acak data soal per matakuliah
    const maxSoalPerMatakuliah = 8;
    for (const [mk, soal] of Object.entries(listSoalByMatakuliah)) {
        for (let i = maxSoalPerMatakuliah * 2 - soal.length; i <= soal.length - 1; i++) {
            listSoalByMatakuliah[mk].splice(Math.floor(Math.random() * soal.length), 1)
        }

        newListSoal.push(...listSoalByMatakuliah[mk])
    }

    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    res.send(shuffle(newListSoal))
})

// tambah data soal
router.post('/', async (req, res) => {
    const { pertanyaan, jawaban, benar, matakuliah } = req.body

    const soal = new Soal({

        pertanyaan,
        jawaban,
        benar,
        matakuliah
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
    const { _id, pertanyaan, jawaban, benar, matakuliah } = req.body

    const newData = { pertanyaan, jawaban, benar, matakuliah }

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