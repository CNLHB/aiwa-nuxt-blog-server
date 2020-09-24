//中间件
//路由中使用
module.exports = ({app}) => {
    return async function verify(ctx, next) {
        const token = ctx.request.headers.authorization.replace('Bearer ', '')
        try {
            let ret = await app.jwt.verify(token, app.config.jwt.secret)
            ctx.state.userid = ret._id
            ctx.state.email = ret.email
            await next()
        } catch (err) {
            console.log(err.name)
            if(err.name === 'TokenExpiredError'){
                return ctx.body = {
                    code: '10004',
                    message: '登录已过期~'
                }
            }
        }
    }
}
