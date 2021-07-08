const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const fs = require('fs')
const sharp = require('sharp')
const path = require('path');
const md5 = require('md5');

// POST
exports.register = async(req,res,next)=>{

    let compressedFile = path.join(__dirname, '../public/uploads/adminAvatar', md5(new Date().getTime()) + '.jpg')
    await sharp(req.file.path)
        .resize(350, 300)
        .jpeg({quality: 60})
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
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role: req.body.role,
        phone:req.body.phone,
        photo: path.basename(compressedFile)
    })
    
    await user.save()
        .then(()=>{
            res.redirect('/moderator/list')
        })
        .catch((error)=>{
            res.status(400).json({
                success:false, 
                data:error
            })
        })
}

exports.userById = async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
        res.status(404).json({
            success: false,
            data: 'User Not Found'
        })
    }
    const admin = req.session.user
    res.render('./moderator/moderator_edit', { title: 'Moderator', layout: './layouts', user: user, admin })

}
exports.allModerator = async (req, res, next) => {
    const user = await User.find({ role: 'moderator' })
        .sort({ date: -1 })
    
        const admin = req.session.user
    
    res.render('./moderator/moderator', { title: 'Admin', layout: './layouts', user: user, admin: admin  })
}

exports.editUser = async (req, res, next) => {
    const user = await User.findByIdAndUpdate({ _id: req.params.id });
    const salt=await bcrypt.genSaltSync(10)
    const password = await bcrypt.hashSync(req.body.password, salt)
    
    if (!user) {
        res.status(404).json({ success: false, data: 'User Not Found' })
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = password;
    user.phone = req.body.phone;

    const admin = req.session.user
    await user
        .save()
        .then(() => {
            res.render('./moderator/moderator_edit', { title: 'Dashboard', layout: './layouts', admin, user  })
        })
        .catch((error) => { res.status(400).json({ success: false, error: error }) })
}
exports.deleteUser = async (req, res, next) => {
    await User.findById({_id: req.params.id})
    .exec(async(error,data)=>{
        if(error){
            res.send(error)
        }
        else{
            const file = path.join(__dirname, '../public/uploads/adminAvatar/' + data.photo)
            fs.unlink(file ,async (err)=>{
                if (err) throw err
                await User.findByIdAndDelete({_id: req.params.id})
                res.redirect('/moderator/list')
            })
        }
    })
}

exports.getMe = async (req, res, next) => {
    const token = req.headers.authorization
    const my = JWT.decode(token.slice(7, token.length))
    const user = await User.findById({ _id: my.id })
    res.status(201).json({ success: true, data: user });
}
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) { res.status(404).json({ success: false, data: 'User not found' }) }
    const resetToken = user.getResetPasswordToken();
    console.log(`This is ResetToken: ${resetToken}`)

    await user.save({ validateBeforeSave: false })
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
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })
        res.status(500).json({ success: false, data: 'Email could not be sent' });
    }
}
exports.resetPassword = async (req, res, next) => {
    const salt = await bcrypt.genSaltSync(12);
    const newHashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const user = await User.findOneAndUpdate({
        resetPasswordToken: req.params.resettoken
    });
    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    user.password = newHashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(user, 200, res);
}
