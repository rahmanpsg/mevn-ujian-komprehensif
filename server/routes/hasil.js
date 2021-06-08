const express = require('express')
const User = require('../models/User')
const Soal = require('../models/Soal')
const Hasil = require('../models/Hasil')
const router = express.Router()

// ambil semua data hasil mahasiswa
router.get('/', async (req, res) => {
    let mahasiswas = await User.find({ role: 'mahasiswa' }, 'nama nim images')
        .populate({ path: 'hasil', select: 'nilai jawaban', populate: { path: 'jawaban.soal', select: 'no pertanyaan benar' } })

    // map Image
    mahasiswas = mapImage(mahasiswas)

    return res.send(mahasiswas)
})

// ambil semua data hasil mahasiswa by penguji
router.get('/:penguji', async (req, res) => {
    const penguji = req.params.penguji

    let mahasiswas = await User.find({ role: 'mahasiswa', penguji }, 'nama nim images')
        .populate({ path: 'hasil', select: 'nilai jawaban', populate: { path: 'jawaban.soal', select: 'no pertanyaan benar' } })

    // map Image
    mahasiswas = mapImage(mahasiswas)

    return res.send(mahasiswas)
})

// cek data ujian mahasiswa
router.get('/cek/:mahasiswa', async (req, res) => {
    const mahasiswa = req.params.mahasiswa

    let hasil = await Hasil.findOne({ mahasiswa }, 'nilai waktuMulai waktuSelesai')


    return res.status(200).send({ data: hasil })
})

// post hasil ujian mahasiswa
router.post('/', async (req, res) => {
    const { mahasiswa, penguji, jawaban, waktuMulai, waktuSelesai } = req.body

    // ambil data soal
    const soals = await Soal.find({ penguji }).select('no benar').sort('no')

    // periksa jawaban
    let benar = 0
    const hasilJawaban = soals.map(v => {
        if (jawaban[v._id] == v.benar) {
            benar++
        }
        return {
            soal: v._id,
            jawab: jawaban[v._id]
        }
    })

    // hitung nilai
    let totalSoal = soals.length
    const nilai = (benar / totalSoal) * 100

    // simpan data hasil
    const hasil = new Hasil({
        mahasiswa,
        jawaban: hasilJawaban,
        waktuMulai,
        waktuSelesai,
        nilai
    })

    hasil.save((err, doc) => {
        if (err) return res.status(500).send({ message: err });

        // save id hasil di model mahasiswa
        User.findByIdAndUpdate({ _id: mahasiswa }, { hasil: doc._id }, { useFindAndModify: false }, err => {
            if (err) return res.status(500).send({ message: err });

            res.status(200).send({
                message: 'Ujian berhasil disimpan',
                waktuMulai: doc.waktuMulai,
                waktuSelesai: doc.waktuSelesai,
                nilai
            })
        });
    })
})

function mapImage(json) {
    return json.map(v => {
        v = v.toJSON()

        v.image = v.images[0]
        delete (v.images)
        return v
    })
}

module.exports = router