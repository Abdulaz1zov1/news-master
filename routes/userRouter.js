const express = require('express');
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const bodyParser = require('body-parser')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })
const {
    register,
    getMe,
    deleteUser,
    userById,
    allModerator,
    editUser
} = require('../controllers/userController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/adminAvatar')
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})
router.post('/register', upload.single('photo'), register) // registratsiya qilish
router.get('/list', allModerator) // hamma moderatorrlarni olish
router.get('/me', getMe); // tokendan yechish
router.delete('/:id', deleteUser) // o'chirish
router.get('/:id', userById) // id bilan olish
router.put('/:id', editUser) // id bilan olish





module.exports = router
