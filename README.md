# server



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

## egg整合mongoose
1. 下载egg-mongoose依赖
2. 配置config plugin
    ```js
        //plugin.js
      'use strict';
       
       /** @type Egg.EggPlugin */
       // module.exports = {
       //   // had enabled by egg
       //   // static: {
       //   //   enable: true,
       //   // }
       // };
       
       exports.mongoose = {
           enable: true,
           package: 'egg-mongoose'
       }
      //config.default.js
   /* eslint valid-jsdoc: "off" */
   
   'use strict';
   
   /**
    * @param {Egg.EggAppInfo} appInfo app info
    */
   module.exports = appInfo => {
       /**
        * built-in config
        * @type {Egg.EggAppConfig}
        **/
       const config = exports = {};
   
       // use for cookie sign key, should change to your own and keep security
       config.keys = appInfo.name + '_1600864714964_7566';
   
       // add your middleware config here
       config.middleware = [];
   
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
   
           }
       };
   };


3. 创建模型
    ```js
       //用户字段设计
       module.exports = app=>{
           let mongoose = app.mongoose
           let Schema = mongoose.Schema
           const UserSchema = new Schema({
               email: {type: String, required: true},
               password: {type: String, required: true},
               nickname: {type: String, required: true},
               avatar: {type: String, required: false, default: '/user.png'},
           })
           return mongoose.model('User', UserSchema)
       }
   ```
4. 使用
    ```js
    
    ```

## egg整合jwt
1. 下载egg-jwt依赖
    ```bash
    yarn add egg-jwt --save
    ```
2. 配置config plugin
    ```js
        //plugin.js
      'use strict';
       exports.jwt = {
           enable: true,
           package: 'egg-jwt'
       }
      //config.default.js
   /* eslint valid-jsdoc: "off" */
   'use strict';
   /**
    * @param {Egg.EggAppInfo} appInfo app info
    */
   module.exports = appInfo => {
       /**
        * built-in config
        * @type {Egg.EggAppConfig}
        **/
       const config = exports = {};
       // use for cookie sign key, should change to your own and keep security
       config.keys = appInfo.name + '_1600864714964_7566';
       // add your middleware config here
       config.middleware = [];
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
              secret: 'aiwa'
           }   
       };
   };


3. 创建模型
    ```js
       //用户字段设计
       module.exports = app=>{
           let mongoose = app.mongoose
           let Schema = mongoose.Schema
           const UserSchema = new Schema({
               email: {type: String, required: true},
               password: {type: String, required: true},
               nickname: {type: String, required: true},
               avatar: {type: String, required: false, default: '/user.png'},
           })
           return mongoose.model('User', UserSchema)
       }
   ```
4. 使用
    ```js
    
    ```

[egg]: https://eggjs.org