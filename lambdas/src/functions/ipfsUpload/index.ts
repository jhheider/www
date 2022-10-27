// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${ssm:AW5_S3_BUCKET}',
        existing: true,
        event: 's3:ObjectCreated:Post',
        rules: [
          {
            suffix: '.gz'
          },
        ]
      },
    },
    {
      s3: {
        bucket: '${ssm:AW5_S3_BUCKET}',
        existing: true,
        event: 's3:ObjectCreated:Post',
        rules: [
          {
            suffix: '.xz'
          },
        ]
      },
    },
  ],
  environment: {
    AWS_DIST_BUCKET: '${ssm:AW5_S3_BUCKET}',
    IPFS_IP4_ADDRESS: '${ssm:/ipfs/ip4_address}',
  }
};
