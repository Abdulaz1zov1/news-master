const express = require('express')
const router = express.Router()
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const bodyParser = require('body-parser')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

const {
    addNews, getAllNews, GetById, DeleteNews, updateNews, info,
    jahon, mahalliy, millioner, ijtimoiy, biznes, lifestyle, export_xaridor, reyting, fotomuxbir, raqobat
} = require('../controllers/newsController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/news')
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })
router.post('/add', upload.single('image'), addNews)
router.put('/update/:id', updateNews)
router.get('/get/all', getAllNews)
router.get('/getbyid/:id', GetById)
router.get('/getInfo/:id', info)
router.delete('/:id', DeleteNews)


/* 
Navbarda ushbu tipga tegishli menu bosilsa keyinggi
oynaada ozining tipiga tegisli bolgan
qismlar chiqib keladi 

*/ 
router.get('/jahon', jahon)
router.get('/mahalliy', mahalliy)
router.get('/millioner', millioner)
router.get('/ijtimoiy', ijtimoiy)
router.get('/biznes', biznes)
router.get('/lifestyle', lifestyle)
router.get('/export', export_xaridor)
router.get('/reyting', reyting)
router.get('/fotomuxbir', fotomuxbir)
router.get('/raqobat', raqobat)





module.exports = router