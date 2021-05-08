const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const User = require('./models/User')
const Soal = require('./models/Soal')

const loginRoute = require('./routes/login')
const faceRoute = require('./routes/face')
const soalRoute = require('./routes/soal')
const mahasiswaRoute = require('./routes/mahasiswa')
const pengujiRoute = require('./routes/penguji')

mongoose
    .connect(`mongodb://localhost:27017/vue_uk`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Berhasil terkoneksi ke MongoDB.");

        initial(); //Membuat data admin jika belum ada

        const app = express()
        app.use(bodyParser.json({ limit: '10mb', extended: true }))
        app.use(cors())

        app.use('/login', loginRoute)
        app.use('/face', faceRoute)
        app.use('/soal', soalRoute)
        app.use('/mahasiswa', mahasiswaRoute)
        app.use('/penguji', pengujiRoute)

        app.get('/totalData', async (req, res) => {
            const totalMahasiswa = await User.countDocuments({ role: 'mahasiswa' })
            const totalPenguji = await User.countDocuments({ role: 'penguji' })
            const totalSoal = await Soal.estimatedDocumentCount()

            res.status(200).send({ totalMahasiswa, totalPenguji, totalSoal })
        })

        app.listen(5000, () => {
            console.log("Server berjalan di http://localhost:5000")
        })
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


function initial() {
    User.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new User({
                username: 'admin',
                password: 'admin',
                role: 'admin'
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Admin telah ditambahkan di DB");
            });
        }
    });
}

