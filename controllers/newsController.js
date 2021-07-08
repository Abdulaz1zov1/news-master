const News=require('../models/news')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path');
const md5 = require('md5');
exports.addNews = async (req, res, next) => {
    
    let compressedFile = path.join(__dirname, '../public/uploads/news', md5(new Date().getTime()) + '.jpg')
    await sharp(req.file.path)
        .resize(450, 300)
        .jpeg({quality: 80})
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

    
    const news = new News({
        title:req.body.title,
        categoryID: req.body.categoryID,
        description:req.body.description,
        tag: req.body.tag,
        image: path.basename(compressedFile)
    })
    news.save()
        .then(() => {
            res.redirect('/new/get/all')
            // console.log(news)
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                error:error
            })
        })
}
exports.updateNews =  async(req, res, next) => {
    const news = await News.findByIdAndUpdate({_id: req.params.id});

    news.title = req.body.title
    news.description = req.body.description

    news.save()

        .then(() => {
            res.redirect('/new/get/all')
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                data: error
            })
        })
}
exports.getAllNews = async (req,res,next) =>{
    const allNews = await News.find()
        .sort({ date: -1 })
    const admin = req.session.user
    res.render('./news/new', { title: 'News', layout: './layouts', allNews: allNews, admin: admin })
}
exports.GetById =  async(req,res,next)=>{
    const allNews = await News.findById({ _id: req.params.id })
    const admin = req.session.user
    res.render('./news/news_edit', { title: 'News', layout: './layouts', allNews: allNews, admin: admin })
}
exports.info =  async (req,res,next)=>{
    const information = await News
        .findById({ _id: req.params.id })
    const admin = req.session.user
    res.render('./news/news_info', { title: 'News', layout: './layouts', information, admin })
}
exports.DeleteNews = async (req, res, next) => {
    await News.findById({_id: req.params.id})
        .exec(async(error,data)=>{
            if(error){
                res.send(error)
            }
            else{
                const file= path.join(__dirname, '../public/uploads/news/' + data.image)
                fs.unlink(file ,async (err)=>{
                    if (err) throw err
                    await News.findByIdAndDelete({_id: req.params.id})
                    res.redirect('/new/get/all')
                })
            }
        })
}




// Navbardagi "jahon yangiliklari" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.jahon = async (req, res, nexr) => {
    const lastTwoNews = await News.find({ categoryID: "jahon" }).sort({ date: -1 }).limit(2)
    const lastNineNews = await News.find({ categoryID: "jahon" }).sort({ date: -1 }).limit(9)
    const belongToTheme = await News.find({ categoryID: "jahon" }).sort({ date: -1 }).skip(10).limit(18)
    res.status(200).json({success: true, data: lastTwoNews, lastNineNews, belongToTheme})
}
// Navbardagi "mahalliy yangiliklari" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.mahalliy = async (req, res, nexr) => {
    const lastTwoNews = await News.find({ categoryID: "mahalliy" }).sort({ date: -1 }).limit(2)
    const lastNineNews = await News.find({ categoryID: "mahalliy" }).sort({ date: -1 }).limit(9)
    const belongToTheme = await News.find({ categoryID: "mahalliy" }).sort({ date: -1 }).skip(10).limit(18)
    res.status(200).json({success: true, data: lastTwoNews, lastNineNews, belongToTheme})
}
// Navbardagi "millioner" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.millioner = async (req, res, nexr) => {
    res.status(200).json({success: true, data: "millioner"})
}
// Navbardagi "ijtimoiy" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.ijtimoiy = async (req, res, nexr) => {
    const lastTwoNews = await News.find({ categoryID: "ijtimoiy" }).sort({ date: -1 }).limit(2)
    const lastNineNews = await News.find({ categoryID: "ijtimoiy" }).sort({ date: -1 }).limit(9)
    const belongToTheme = await News.find({ categoryID: "ijtimoiy" }).sort({ date: -1 }).skip(10).limit(18)
    res.status(200).json({success: true, data: lastTwoNews, lastNineNews, belongToTheme})
}
// Navbardagi "biznes" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.biznes = async (req, res, nexr) => {
    const lastTwoNews = await News.find({ categoryID: "biznes" }).sort({ date: -1 }).limit(2)
    const lastNineNews = await News.find({ categoryID: "biznes" }).sort({ date: -1 }).limit(9)
    const belongToTheme = await News.find({ categoryID: "biznes" }).sort({ date: -1 }).skip(10).limit(18)
    res.status(200).json({success: true, data: lastTwoNews, lastNineNews, belongToTheme})
}
// Navbardagi "lifestyle" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.lifestyle = async (req, res, nexr) => {
    res.status(200).json({success: true, data: "lifestyle"})
}
// Navbardagi "export_xaridor" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.export_xaridor = async (req, res, nexr) => {
    const lastTwoNews = await News.find({ categoryID: "export_xaridor" }).sort({ date: -1 }).limit(2)
    const lastNineNews = await News.find({ categoryID: "export_xaridor" }).sort({ date: -1 }).limit(9)
    const belongToTheme = await News.find({ categoryID: "export_xaridor" }).sort({ date: -1 }).skip(10).limit(18)
    res.status(200).json({success: true, data: lastTwoNews, lastNineNews, belongToTheme})
}
// Navbardagi "reyting" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.reyting = async (req, res, nexr) => {
    res.status(200).json({success: true, data: "reyting"})
}

// Navbardagi "fotomuxbir" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.fotomuxbir = async (req, res, nexr) => {
    res.status(200).json({success: true, data: "fotomuxbir"})
}
// Navbardagi "raqobat" bosilganda  yangi oynada chiqishi kerak bolgan narsalar
exports.raqobat = async (req, res, nexr) => {
    res.status(200).json({success: true, data: "raqobat"})
}
