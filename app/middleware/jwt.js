//中间件
//路由中使用
module.exports = ({app}) => {
    return async function verify(ctx, next) {
        let token = ctx.request.headers.authorization
        token = token && token.replace('Bearer ', '')
        if (!token) {
            return ctx.body = {
                code: -1,
                message: '请携带凭证!'
            }
        }
        try {
            let ret = await app.jwt.verify(token, app.config.jwt.secret)
            ctx.state.userid = ret._id
            ctx.state.email = ret.email
            await next()
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return ctx.body = {
                    code: 10004,
                    message: '登录已过期!'
                }
            }
        }
    }
}
