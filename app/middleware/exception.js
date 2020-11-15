const {HttpException} = require('../core/http-exception')
/**
 * catchError
 * @param options
 * @param app
 * @returns {function(...[*]=)}
 */
module.exports = (options, app) => {
    return async function catchError(ctx, next)  {
        try {
            await next()

        } catch (error) {
            console.log("全局错误捕获:"+error.message)
            console.log(error)
            // 开发环境
            const isHttpException = error instanceof HttpException;
            const isDev = app.config.env === 'local';
            if (isDev && !isHttpException) {
                throw error
            }else{
                return ctx.body = {
                    code: error.code,
                    message: error.msg
                }
            }
            // 生成环境
            if (isHttpException) {
                ctx.body = {
                    msg: error.msg,
                    error_code: error.errorCode,
                    request: `${ctx.method} ${ctx.path}`
                }
                ctx.response.status = 200 //error.code
            } else {
                ctx.body = {
                    msg: "未知错误！",
                    error_code: 9999,
                    request: `${ctx.method} ${ctx.path}`
                }
                ctx.response.status = 500
            }
        }
    }

};


