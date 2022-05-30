const AWS = require("aws-sdk");
const keys = require("../config/keys");
const uuid = require("uuid").v4;
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: "v4",
  region: "us-east-1"
});

module.exports = app => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: "node-blog-bucket-1234",
       ContentType: "image/jpeg",
      Key: key,
      Expires: 900
    });

    res.send({key, signedUrl})
  
  });
};



/*

AWS s3 

getSignedURL: 

operationName--> name of the operation we want to create the presigned URL for.

params--> 
- Bucket: name of bucket 
- Key: name of file we are uploading
- ContentType: of the file that will be getting uploaded.  

*/
