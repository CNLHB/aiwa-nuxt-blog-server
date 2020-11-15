'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    const jwt = app.middleware.jwt({app})
    let {
        following,followers,
        articleStatus,
        likeArticle,cancelLikeArticle
    } = controller.user
    router.get('/', controller.home.index);
    // 这个接口，需要登录后 才能获取到
    // 从token信息中，拿到用户数据，然后查库 返回
    router.post('/user/info', jwt, controller.user.info);
    router.get('/user', controller.home.user);
    router.get('/user/isfollow/:id', jwt, controller.user.isFollow);
    router.put('/user/follow/:id', jwt, controller.user.follow);
    router.delete('/user/follow/:id', jwt, controller.user.unFollow);
    router.get('/user/captcha', controller.user.captcha);
    router.post('/user/register', controller.user.register);
    router.post('/user/login', controller.user.login);
    router.post('/article/create', jwt, controller.article.create);
    router.get('/article/:id', controller.article.detail);
    router.get('/article', controller.article.list);

    router.get('/user/:id/following', following)
    router.get('/user/:id/followers', followers)

    router.get('/article/:id', jwt, articleStatus)
    // .put点赞，。delete取消点赞
    router.put('/likeArticle/:id',jwt,likeArticle)
    router.delete('/likeArticle/:id',jwt,cancelLikeArticle)
    router.post("/upload", controller.utils.uploadFiles);
    // router.group({name: 'article', prrfix: '/article'}, router => {
    //     router.post('/create', jwt, controller.article.create)
    //     router.get('/:id', controller.article.detail)
    // })
};
