const express = require('express')
const router = express.Router()
const PdfTable = require('voilab-pdf-table')
const PDFDocument = require('pdfkit');
const User = require('../models/User')

// generete PDF Berita Acara
router.get('/', async (req, res) => {
    const mahasiswas = await User.find({ role: 'mahasiswa', hasil: { $ne: null } }).select('nama nim')
        .populate({ path: 'hasil', select: 'nilai' })

    let doc = new PDFDocument({
        size: 'LEGAL', margins: { top: 10, left: 30, right: 30, bottom: 10 }
    });

    let table = new PdfTable(doc, {
        bottomMargin: 30
    })

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*'
    });

    doc.pipe(res);

    doc.image('public/logo.png', {
        fit: [50, 50],
    });

    doc.font('Helvetica-Bold')
        .fontSize(30)
        .text('FAKULTAS TEKNIK', 90, 15);

    doc.font('Helvetica').fontSize(12)
        .text('UNIVERSITAS MUHAMMADIYAH PAREPARE', 90, 45);

    doc.moveDown();
    doc.image('public/bismillah.jpg', 245, 70, {
        fit: [100, 100],
        align: 'center'
    });

    doc.moveDown();
    doc.moveDown();
    doc.font('Helvetica-Bold')
        .text(`BERITA ACARA SEMINAR KOMPREHENSIF`, {
            width: 410,
            align: 'center',

        }
        );

    doc.font('Helvetica')

    const opt = { continued: true }

    doc.moveDown();
    doc.text("Program Studi", 30, doc.y, opt)
    doc.text(": Teknik Informatika", doc.x + 48, doc.y, opt)
    doc.text("Semester", 250, doc.y, opt)
    doc.text(":", doc.x + 42)

    doc.text("Jenjang Pendidikan", opt)
    doc.text(": Strata Satu (S1)", 50, doc.y, opt)
    doc.text("Waktu", 233, doc.y, opt)
    doc.text(": 60 Menit", doc.x + 60)

    doc.text("Jumlah Peserta", 430, doc.y, opt)
    doc.text(`: ${mahasiswas.length}`, doc.x + 10)

    doc.moveDown();

    table
        .setColumnsDefaults({
            headerBorder: ['L', 'T', 'B', 'R'],
            border: ['L', 'T', 'B', 'R'],
            headerPadding: [10, 0, 5, 5],
            padding: [5, 0, 0, 0],
            align: 'center'
        })
        .addColumns([
            {
                id: 'no',
                header: 'No',
                width: 50
            },
            {
                id: 'nim',
                header: 'NIM',
                width: 150,
            },
            {
                id: 'nama',
                header: 'Nama Mahasiswa',
                width: 250,
            },
            {
                id: 'nilai',
                header: 'Rata-rata',
                width: 100,
            }
        ])
        .onPageAdded(function (tb) {
            tb.addHeader();
        });

    const dataTableMhs = mahasiswas.map((v, i) => {
        return { no: i + 1, nim: v.nim, nama: v.nama, nilai: v.hasil.nilai }
    })

    table.addBody(dataTableMhs);



    // Finalize PDF file
    doc.end();
});

module.exports = router;