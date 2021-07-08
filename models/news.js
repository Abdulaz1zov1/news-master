const mongoose=require('mongoose')
const News = mongoose.Schema({
    title:{type:String,required:true},
    categoryID: {
        type: String,
        enum: [
            "jahon",
            "mahalliy",
            "millioner",
            "ijtimoiy",
            "biznes",
            "lifestyle",
            "export-xaridor",
            "reyting",
            "fotomuxbir",
            "raqobat"
        ],
        required: true

    },
    description:{type:String,required:true},
    tag:[{type:String,required:true}],
    image:{type:String,required:true},
    date:{type:Date,default:Date.now()}
})

module.exports=mongoose.model('News',News)