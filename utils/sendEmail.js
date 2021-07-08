const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 2525,
    auth: {
        user: 'kamina94@inbox.ru',
        pass: '+998915700004'
    },
},{
    from: 'Admin <kamina94@inbox.ru>'
});
const sendEmail = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) return console.log(err)
        // console.log('Email is sent', info)
    })
}
module.exports =  sendEmail