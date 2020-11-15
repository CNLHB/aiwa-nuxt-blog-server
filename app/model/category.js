//分类字段设计
module.exports = app => {
    let mongoose = app.mongoose
    let Schema = mongoose.Schema
    const CategorySchema = new Schema({
        "__v": {type: Number, select: false},
        name: {type: String, required: true},
        description: {type: String, required: false, default: '当前无描述~'},
        avatar: {type: String, required: false, default: 'http://image.xquery.cn/1592214400926bg01.jpg'},
        tabs: {
            type: [{
                type: Schema.Types.ObjectId,//Schema.Types.ObjectIdMixed
                ref: 'User'
            }]
        }
    }, {
        timestamps: true
    })
    return mongoose.model('Category', CategorySchema)
}