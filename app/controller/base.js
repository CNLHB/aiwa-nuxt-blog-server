const Controller = require('egg').Controller

//提供公共方法
class BaseController extends Controller {
    success(data, code = 0,message="success") {
        this.ctx.body = {
            code,
            data,
            message
        }
    }

    message(msg, code = 0) {
        this.ctx.body = {
            code,
            message: msg
        }
    }

    error(msg, code = 10004) {
        this.ctx.body = {
            code,
            message: msg
        }
    }

}
module.exports = BaseController