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

    async info() {
        let {ctx} = this
        let {email, userid} = ctx.state
        const user = await this.checkEmail(email)

        this.success(user)
    }

}

module.exports = HomeController;
