'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({app})
  router.get('/', controller.home.index);
  router.post('/user/info', jwt, controller.user.info);
  router.get('/user', controller.home.user);
  router.get('/user/captcha', controller.user.captcha);
  router.post('/user/register', controller.user.register);
  router.post('/user/login', controller.user.login);
};
