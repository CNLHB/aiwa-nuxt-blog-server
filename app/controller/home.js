'use strict';

const BaseController = require('./base')

class HomeController extends BaseController {
    async index() {
        this.success('成功')
    }
    async user() {
        this.success('user')
    }

}

module.exports = HomeController;
