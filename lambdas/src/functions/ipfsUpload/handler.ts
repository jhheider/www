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
      const { key } = record.s3.object;
      const isPackage =  key.split('/').length > 1;
      if(!isPackage) continue

      // const objectURL = "https://" + process.env.BUCKET + ".s3.amazonaws.com/" + record.s3.object.key
      const fileName = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "))

      // download file to /tmp
      const { Body } = await s3.getObject({
        Bucket: process.env.AWS_DIST_BUCKET,
        Key: key,
      }).promise();

      console.log(`adding key:${key} to ipfs...`);
      const cid = await http.add(Body);

      const cidHash = cid[0].hash
  
      console.log(`added cid file: ${key}.cid`);
      
      const s3Ack = await s3.putObject({
        Bucket: process.env.AWS_DIST_BUCKET,
        Key: fileName + ".cid",
        Body: cidHash
      }).promise()
      
      console.log({s3Ack})
    } catch (error) {
      console.error(error);
    }
  }
}

export const main = ipfsUpload;