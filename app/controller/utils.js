'use strict';

const BaseController = require('./base')

class UtilsController extends BaseController {
    async uploadFiles() {
        const { ctx } = this;
        const data = await ctx.service.utils.uploadFiles();
        if(data){
            this.success(data)
        }else{
            this.success("文件上传失败")
        }
    }
}
module.exports = UtilsController;
