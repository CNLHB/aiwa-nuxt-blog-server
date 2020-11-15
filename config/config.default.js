/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const whitelist = [
    // images
    '.jpg', '.jpeg', // image/jpeg
    '.png', // image/png, image/x-png
    '.gif', // image/gif
    '.bmp', // image/bmp
    '.wbmp', // image/vnd.wap.wbmp
    '.webp',
    '.tif',
    '.psd',
    // text
    '.svg',
    '.js', '.jsx',
    '.json',
    '.css', '.less',
    '.html', '.htm',
    '.xml',
    // tar
    '.zip',
    '.gz', '.tgz', '.gzip',
    // video
    '.mp3',
    '.mp4',
    '.avi',
];
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1600864714964_7566';
    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true
        },
        domainWhiteList: '*'
    };
    config.cors = {
        origin:'*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };
    // add your middleware config here
    config.middleware = ['exception'];
    config.multipart = {
        fileSize: '50mb',
        mode: 'stream',
    };
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
        security: {
            csrf: {
                enable: false,
            }
        },
        mongoose: {
          client: {
              url: 'mongodb://127.0.0.1:27017/aiwa',
              options: {

              }
          }
        },
        jwt: {
            secret: 'aiwa@GOOD'
        }

    };
};
