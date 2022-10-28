// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${ssm:AW5_S3_BUCKET}',
        existing: true,
        event: 's3:ObjectCreated:*',
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
        event: 's3:ObjectCreated:*',
        rules: [
          {
            suffix: '.xz'
          },
        ]
      },
    },
    {
      s3: {
        bucket: '${ssm:AW5_S3_BUCKET}',
        existing: true,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            suffix: '.sha256sum'
          },
        ]
      },
    },
    {
      s3: {
        bucket: '${ssm:AW5_S3_BUCKET}',
        existing: true,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            suffix: '.txt'
          },
        ]
      },
    },
    {
      s3: {
        bucket: '${ssm:AW5_S3_BUCKET}',
        existing: true,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            suffix: '.tgz'
          },
        ]
      },
    },
  ],
  environment: {
    AWS_DIST_BUCKET: '${ssm:AW5_S3_BUCKET}',
    IPFS_IP4_ADDRESS: '${ssm:/ipfs/ip4_address}',
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        's3:GetObject',
        's3:PutObject',
      ],
      Resource: [
        "arn:aws:s3:::${ssm:AW5_S3_BUCKET}",
        "arn:aws:s3:::${ssm:AW5_S3_BUCKET}/*",
        "arn:aws:s3:::${ssm:AW5_S3_BUCKET}/*/*",
      ]
    }
  ]
};
