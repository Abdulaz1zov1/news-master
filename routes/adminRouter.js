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
    login,
    forgotPassword,
    resetPassword,
    editAdmin,
    deleteAdmin,
    getByIdAdmin
} = require('../controllers/AdminController');
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/adminAvatar')
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

router.post('/add', upload.single('photo'), register);
router.post('/login', parseForm, csrfProtection, login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.delete('/:id', deleteAdmin)
router.get('/:id', getByIdAdmin)
router.put('/:id', upload.single('photo'), editAdmin)



module.exports = router