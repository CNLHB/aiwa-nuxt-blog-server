const Service = require("egg").Service;
const fs = require("fs");
const path = require("path");
const md5 = require('md5')
const qiniu = require("qiniu");
const awaitWriteStream = require("await-stream-ready").write;
const sendToWormhole = require("stream-wormhole");
const {qiniuConfig} = require('../config/config')
const  {bucket,imageUrl, accessKey, secretKey} = qiniuConfig

// const bucket = qiniu.bucket; //要上传的空间名
// const imageUrl = qiniu.imageUrl; // 空间绑定的域名
// const accessKey = qiniu.accessKey; //Access Key
// const secretKey = qiniu.secretKey; //Secret Key
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
    scope: bucket
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
let config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
class utilsService extends Service {
    async uploadFiles() {
        const { ctx } = this;
        const stream = await ctx.getFileStream();
        if (!stream)return '文件上传失败!'
        const filename =
            md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
        const localFilePath = path.join(__dirname, "../public/uploads", filename);
        const writeStream = fs.createWriteStream(localFilePath);
        try {
            await awaitWriteStream(stream.pipe(writeStream));
            const formUploader = new qiniu.form_up.FormUploader(config);
            const putExtra = new qiniu.form_up.PutExtra();
            const imgSrc = await new Promise((resolve, reject) => {
                formUploader.putFile(
                    uploadToken,
                    filename,
                    localFilePath,
                    putExtra,
                    (respErr, respBody, respInfo) => {
                        // console.log(respBody)
                        // console.log(respInfo)
                        if (respErr||respBody.error) {
                            reject(respBody.error);
                        }
                        if (respInfo.statusCode == 200) {
                            console.log(respBody.key)
                            resolve(imageUrl + respBody.key);
                        } else {
                            reject("");
                        }
                        // 上传之后删除本地文件
                        fs.unlinkSync(localFilePath);
                    }
                );
            });
            if (imgSrc !== "") {
                return imgSrc
            } else {
                return false;
            }
        } catch (err) {
            //如果出现错误，关闭管道
            console.log(err)
            await sendToWormhole(stream);
            console.log('文件上传失败')
            return false;
        }
    }
}
module.exports = utilsService;