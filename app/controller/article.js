'use strict';
const BaseController = require('./base');

class ArticleController extends BaseController {
    /**
     * 查询文章列表
     * @returns {Promise<void>}
     */
    async list(){
        const {ctx} = this
        let ret = await ctx.model.Article.find().populate('author')
        this.success(ret)
    }
    /**
     * 查询文章详情  + 文章作者信息
     * @returns {Promise<void>}
     */
    async detail() {
        const {ctx} = this
        const {id} = ctx.params
        try {
            let info = await ctx.model.Article.findOneAndUpdate(
                {_id: id}, {$inc: {'views': 1}})
                .populate('author')
            this.success(info)
        } catch(err) {
            this.error("查询参数有误!")
        }
    }

    async create() {
        let {ctx} = this
        let {userid} = ctx.state
        const {content, title} = ctx.request.body
        // 我们需要对content做一些转义处理
        // let title = content.split('\n').find(v=>{
        //   return v.indexOf('# ')==0
        // })551
        let obj = {
            // title:title.replace('# ', ''),
            content,
            title,
            author: userid
        }
        let ret = await ctx.model.Article.create(obj)
        if (ret._id) {
            this.success({
                id: ret._id,
                title: obj.title
            })
        } else {
            this.error('文章创建失败')
        }
    }

}

module.exports = ArticleController