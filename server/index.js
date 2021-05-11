const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const chalk = require('chalk')

const userModel = require('./models/User')
const soalModel = require('./models/Soal')

const loginRoute = require('./routes/login')
const faceRoute = require('./routes/face')
const soalRoute = require('./routes/soal')
const mahasiswaRoute = require('./routes/mahasiswa')
const pengujiRoute = require('./routes/penguji')
const hasilRoute = require('./routes/hasil')

mongoose
    .connect(`mongodb://localhost:27017/vue_uk`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(chalk.yellow("Berhasil terkoneksi ke MongoDB."));

        initial(); //Membuat data admin jika belum ada

        const app = express()
        app.use(bodyParser.json({ limit: '10mb', extended: true }))
        app.use(cors())

        app.use(express.static('./dist/'));

        app.get('/', (req, res) => {
            res.sendFile(__dirname, './dist/index.html');
        });

        app.use('/login', loginRoute)
        app.use('/face', faceRoute)
        app.use('/soal', soalRoute)
        app.use('/mahasiswa', mahasiswaRoute)
        app.use('/penguji', pengujiRoute)
        app.use('/hasil', hasilRoute)

        app.get('/totalData', async (req, res) => {
            const totalMahasiswa = await userModel.countDocuments({ role: 'mahasiswa' })
            const totalPenguji = await userModel.countDocuments({ role: 'penguji' })
            const totalSoal = await soalModel.estimatedDocumentCount()

            res.status(200).send({ totalMahasiswa, totalPenguji, totalSoal })
        })

        app.listen(5000, () => {
            const ip = require('ip');

            console.log('Aplikasi berjalan di:');
            console.log("- Local :", chalk.bgGreen("http://localhost:5000/"))
            console.log("- Network : ", chalk.bgGreen(`http://${ip.address()}:5000/`))
        })
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


function initial() {
    userModel.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new userModel({
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

