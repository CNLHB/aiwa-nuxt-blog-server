const Service = require('egg').Service
const svgCaptcha = require('svg-captcha')
class ToolsService extends Service {
     captcha(){
        let capt = svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            noise: 3
        })
         return capt
    }

}

module.exports = ToolsService

