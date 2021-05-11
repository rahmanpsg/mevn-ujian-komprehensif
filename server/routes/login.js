const express = require('express')
const User = require('../models/User')
const router = express.Router()

// login
router.post('/', async (req, res) => {
    const { username, password } = req.body

    // .populate({ path: 'mahasiswa', select:  } })

    User.findOne({ username }, { images: { $slice: 1 } }).exec((err, doc) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return
        }

        if (!doc) {
            res.status(404).send({ message: 'Username tidak ditemukan' })
            return
        }

        if (password != doc.password) {
            res.status(401).send({ message: 'Username atau password salah' })
            return
        }

        const user = doc.toJSON()

        user.image = user.images[0]
        delete user.images

        res.status(200).send({
            message: 'Anda berhasil login',
            user
        })

    })
})

module.exports = router