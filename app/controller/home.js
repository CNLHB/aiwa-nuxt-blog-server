'use strict';

const BaseController = require('./base')
const {NotFound}  = require('../core/http-exception')
class HomeController extends BaseController {
    async index() {
        throw new NotFound()
        this.success('成功')
    }
    async user() {
        this.success('user')
    }

}

module.exports = HomeController;
