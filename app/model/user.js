//用户字段设计
module.exports = app => {
    let mongoose = app.mongoose
    let Schema = mongoose.Schema
    const UserSchema = new Schema({
        "__v": {type: Number, select: false},
        email: {type: String, required: true},
        password: {type: String, required: true, select: false},
        nickname: {type: String, required: true},
        description: {type: String, required: false, default: '当前无描述~'},
        avatar: {type: String, required: false, default: 'http://image.xquery.cn/1592214400926bg01.jpg'},
        following: {
            type: [{
                type: Schema.Types.ObjectId,//Schema.Types.ObjectId
                ref: 'User'
            }]
        },
        likeArticle: {
            type: [{type: Schema.Types.ObjectId, ref: 'Article'}]
        },
        disLikeArticle: {
            type: [{type: Schema.Types.ObjectId, ref: 'Article'}]
        },
    }, {
        timestamps: true
    })
    return mongoose.model('User', UserSchema)
}