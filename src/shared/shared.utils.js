import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const bucketInstance = new AWS.S3();

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "nomad-coffee-uploads-hi6724",
      Key: objectName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const deleteFileS3 = async (fileName, folderName) => {
  const objectName = fileName.split(`/${folderName}/`)[1];
  await new AWS.S3()
    .deleteObject({
      Bucket: `nomad-coffee-uploads-hi6724`,
      Key: `${folderName}/${decodeURI(objectName)}`,
    })
    .promise();
};
