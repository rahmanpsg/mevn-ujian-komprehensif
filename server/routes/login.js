const express = require('express')
const User = require('../models/User')
const router = express.Router()

// login
router.post('/', async (req, res) => {
    const { username, password } = req.body

    User.findOne({
        username,
    }).select(['username', 'password', 'nama', 'nim', 'nbm', 'penguji', 'role']).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return
        }

        if (!user) {
            res.status(404).send({ message: 'Username tidak ditemukan' })
            return
        }

        if (password != user.password) {
            res.status(401).send({ message: 'Username atau password salah' })
            return
        }

        res.status(200).send({
            message: 'Anda berhasil login',
            user
        })

    })
})

module.exports = router