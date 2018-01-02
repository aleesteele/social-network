//*------------------UPLOAD IMAGE------------------*//
const express = require('express');
const app = express();
const knox = require('knox');
const config = require('../config/config.json');
const fs = require('fs');
let secrets; //these are for the amazon...

//*------------------AWS CLIENT------------------*//
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('../config/secrets.json');
}

const client = knox.createClient({
    key: secrets.awsKey,
    secret: secrets.awsSecret,
    bucket: 'imgboard-anne-sp'
});

//*------------------UPLOAD TO AWS------------------*//
module.exports.uploadProfPic = function(file) {
    return new Promise(function(resolve, reject) { //THIS IS FROM MY NOTES... I DON'T UNDERSTAND
        const s3Request = client.put(file.filename, {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
            'x-amz-acl': 'public-read'
        });
        const readStream = fs.createReadStream(file.path); //fs.createWriteStream(path[, options]); fs.exists(path, callback)
        readStream.pipe(s3Request);
        s3Request.on('response', s3Response => {
            const wasSuccessful = s3Response.statusCode == 200;
            if (wasSuccessful) {
                resolve()
            }
            else {
                s3Response.statusCode == 404; //not right but indicates that an error is needed!
                reject()
            }
        })
    })
}
