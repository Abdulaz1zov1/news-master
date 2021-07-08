const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const fs = require('fs')
const sharp = require('sharp')
const path = require('path');
const md5 = require('md5');
const session = require('express-session')

exports.register = async (req, res, naext) => {
    // const salt = await bcrypt.genSaltSync(10)
    // const password = await bcrypt.hashSync(req.body.password, salt)

    let compressedFile = path.join(__dirname, '../public/uploads/adminAvatar', md5(new Date().getTime()) + '.jpg')
    await sharp(req.file.path)
        .resize(350, 300)
        .jpeg({ quality: 60 })
        .toFile(compressedFile, (error) => {
            if (error) {
                res.send(error)
            }
            fs.unlink(req.file.path, async (error) => {
                if (error) {
                    res.send(error)
                }
            })
        })

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        phone: req.body.phone,
        photo: path.basename(compressedFile)
    })
    

    await user.save()
        .then(() => {
            res.status(201).json({ success: true, data: user })
            // res.redirect('/moderator/list')
            // console.log(user)
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                data: error
            })
        })
}
exports.login = async (req, res, next) => {
    const { email, password } = req.body;


    // Parolni solishtirish
    if (!email || !password) {
        res.redirect('/login')
    }
    const users = await User.findOne({ email: email }).select('password');
    if (!users) {
        res.redirect('/login')
    }
    const isMatch = await users.matchPassword(password);
    if (!isMatch) {
        res.redirect('/login');
    }

    // Avtorizatsiyadan o'tgan paytda sessiya paydo boladi, ungacha ko'rinmaydi
    const body = await User.findOne({ email: req.body.email })
    req.session.user = body
    req.session.save()


    req.session.isAuth = true
    res.redirect('/dashboard')
}



exports.getByIdAdmin = async (req, res) => {
    const admin = await User.findById({ _id: req.params.id })
    if (!admin) {
        res.status(404).json({ success: false, data: 'User Not Found' })
    }
    res.render('./admin/admin_edit', {title: 'Karvon',
        layout: './layouts',
        admin: admin
    })
}
exports.editAdmin = async (req, res, next) => {
    const admin = await User.findByIdAndUpdate({ _id: req.params.id })
    const salt = await bcrypt.genSaltSync(10)
    const password = await bcrypt.hashSync(req.body.password, salt)

    if (!admin) {
        res.status(404).json({ success: false, data: 'User Not Found' })
    }

    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = password;
    admin.phone = req.body.phone;

    const admins = req.session.user

    await admin
        .save()
        .then(() => {
            res.render('./admin/admin_edit', { title: 'Dashboard', layout: './layouts', admin, admins  })
        })
        .catch((error) => { res.status(400).json({ success: false, error: error }) })
}
exports.deleteAdmin = async (req, res, next) => {
    await User.findById({ _id: req.params.id })
        .exec(async (error, data) => {
            if (error) {
                res.send(error)
            }
            else {
                const file = path.join(__dirname, '../public/uploads/adminAvatar/' + data.photo)
                fs.unlink(file, async (err) => {
                    if (err) throw err

                    await User.findByIdAndDelete({ _id: req.params.id })
                
                    res.redirect('/moderator/list')
                })
            }
        })
}

exports.forgotPassword = async (req, res, next) => {
    const admin = await User.findOne({ email: req.body.email })
    if (!admin) { res.status(404).json({ success: false, data: 'User not found' }) }
    const resetToken = admin.getResetPasswordToken();
    console.log(`This is ResetToken: ${resetToken}`)

    await admin.save({ validateBeforeSave: false })
    const resetUrl = `${req.protocol}://LCP/resetpassword/${resetToken}`;

    const msg = {
        to: req.body.email,
        subject: 'Parolni tiklash manzili',
        html: `Parolini tiklash uchun ushbu tugmani bosing  <a type="button" href="${resetUrl}" 
            style="cursor: pointer;background-color: #eee ">Tugma</a>`
    };
    try {
        await sendEmail(msg)
        res.status(200).json({ success: true, data: 'Email is sent' });
    } catch (err) {
        console.log(err)
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;

        await admin.save({ validateBeforeSave: false })
        res.status(500).json({ success: false, data: 'Email could not be sent' });
    }
}
exports.resetPassword = async (req, res, next) => {
    const salt = await bcrypt.genSaltSync(12);
    const newHashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const admin = await User.findOneAndUpdate({
        resetPasswordToken: req.params.resettoken
    });
    if (!admin) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    admin.password = newHashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();
    sendTokenResponse(admin, 200, res);
}

