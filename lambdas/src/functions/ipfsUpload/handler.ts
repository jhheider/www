import AWS from 'aws-sdk';
import { S3CreateEvent } from 'aws-lambda';
import ipfs from 'ipfs-http-client';
import fs from 'fs';

const s3 = new AWS.S3();

const ipfsUpload = async (event: S3CreateEvent) => {
  const http = ipfs(process.env.IPFS_IP4_ADDRESS);
  
  // S3 interaction
  for (const record of event.Records){
    try {
      const { key, size } = record.s3.object;
      const isPackage =  key.split('/').length > 1;
      if(!isPackage) continue

      // const objectURL = "https://" + process.env.BUCKET + ".s3.amazonaws.com/" + record.s3.object.key
      const fileName = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "))

      // download file to /tmp      
      const s3ReadStream = s3.getObject({
        Bucket: process.env.AWS_DIST_BUCKET,
        Key: key,
      }).createReadStream();

      console.log(`adding key:${key} to ipfs...`);
      const cid = await http.add(s3ReadStream, {
        progress: (progress) => {
          const progressPercent = Math.floor(progress/size * 100);
          console.log(`ipfs upload progress ${progressPercent}% ${fileName}`);
        }
      });
      console.log('file added to ipfs.');

      const cidHash = cid[0].hash
      console.log(`adding cid file: ${key}.cid`);
      await s3.putObject({
        Bucket: process.env.AWS_DIST_BUCKET,
        Key: fileName + ".cid",
        Body: cidHash
      }).promise()
      console.log('cid file added.');
    } catch (error) {
      console.error(error);
    }
  }
}


export const main = ipfsUpload;