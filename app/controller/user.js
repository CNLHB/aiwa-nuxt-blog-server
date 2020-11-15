'use strict';

const BaseController = require('./base')

class HomeController extends BaseController {
    async index() {
        this.success('成功')
    }

    /**
     * 验证码
     * @returns {Promise<void>}
     */
    async captcha() {
        const {ctx} = this
        let capt = this.service.tools.captcha()
        //在客户端种下cookie
        ctx.session.captcha = capt.text
        ctx.response.type = 'image/svg+xml'
        ctx.body = capt.data
    }

    async checkEmail(email) {
        const user = await this.ctx.model.User.findOne({email})
        return user
    }

    /**
     * 用户注册
     * @returns {Promise<void>}
     */
    async register() {
        const {ctx} = this
        const {captcha, email, password, nickname} = ctx.request.body
        if (captcha.toUpperCase() == ctx.session.captcha.toUpperCase()) {
            if (await this.checkEmail(email)) {
                this.success("邮箱重复了~")
                return
            }
            let ret = await ctx.model.User.create({
                email,
                nickname,
                password
            })
            if (ret._id) {
                this.success(ret)
            }

        } else {
            this.error("验证码错误")
        }


    }

    async isFollow() {
        const {ctx} = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        const isFollow = !!me.following.find(v => {
            return v.toString() == ctx.params.id
        })
        this.success({isFollow})
    }

    async follow() {
        //关注用户
        const {ctx} = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        const isFollow = !!me.following.find(v => {
            return v.toString() == ctx.params.id
        })
        if (!isFollow) {
            try {
                me.following.push(ctx.params.id)
                me.save()
                this.success("关注成功")
            } catch (e) {
                console.log(e)
                this.error("关注失败")
            }
            console.log(me)
        } else {
            this.error("关注失败")
        }
    }

    async unFollow() {
        const {ctx} = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        const index = !!me.following.map(v => v.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.following.splice(index, 1)
            me.save()
            this.success("取消成功")
        } else {
            this.error("关注失败")
        }
    }

    /**
     * 登录
     * 检验
     * @returns {Promise<void>}
     */
    async login() {
        const {ctx, app} = this
        const {email, password} = ctx.request.body
        let user = await ctx.model.User.findOne({
            email, password
        })
        if (user) {
            const {nickname} = user
            const token = app.jwt.sign({
                email,
                _id: user._id
            }, app.config.jwt.secret, {
                expiresIn: 60 * 60 * 12 + 's'
            })
            this.success({token, email, nickname})
        } else {
            this.error('用户名或密码错误~')
        }

    }

    async following() {
        // load关注的人
        const {ctx} = this
        const users = await ctx.model.User.findById(ctx.params.id)
            .populate('following')
        this.success(users.following)
    }

    async followers() {
        const {ctx} = this
        let users = await ctx.model.User.find({following: ctx.params.id})
        this.success(users)
    }

    async articleStatus() {

        // return this.success(1)
        const {ctx} = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        let like = !!me.likeArticle.find(id => id.toString() == ctx.params.id)
        let dislike = !!me.disLikeArticle.find(id => id.toString() == ctx.params.id)
        this.success({
            like,
            dislike
        })
    }

    async cancelLikeArticle() {
        // 数组删除
        const {ctx} = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        const index = me.likeArticle.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.likeArticle.splice(index, 1)
            me.save()
            await ctx.model.Article.findByIdAndUpdate(ctx.params.id, {$inc: {like: -1}})
            return this.message('取消成功')
        }

    }

    async likeArticle() {
        // 数组新增
        const {ctx} = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        if (!me.likeArticle.find(id => id.toString() == ctx.params.id)) {
            me.likeArticle.push(ctx.params.id)
            me.save()
            await ctx.model.Article.findByIdAndUpdate(ctx.params.id, {$inc: {like: 1}})
            return this.message('点赞成功')
        }
        return this.message('点过了')
    }

    async info() {
        let {ctx} = this
        let {email, userid} = ctx.state
        const user = await this.checkEmail(email)

        this.success(user)
    }

}

module.exports = HomeController;
