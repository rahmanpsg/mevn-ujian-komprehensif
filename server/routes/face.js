const express = require('express')
const User = require('../models/User')
const router = express.Router()

// get all face
router.get('/', async (req, res) => {
    const users = await User.find({ role: ['mahasiswa', 'penguji'] })

    res.send(users)
})


router.post('/', async (req, res) => {
    const nama = req.body.nama
    const descriptions = req.body.descriptions

    User.updateOne(
        { nama },
        {
            $set: {
                descriptions
            }
        }
    ).then((result, err) => {
        return res.status(200).json({ data: result, message: "Value Updated" });
    })
})

module.exports = router