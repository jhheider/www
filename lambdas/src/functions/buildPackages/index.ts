// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [],
  environment: {
    AIRTABLE_API_KEY: '${ssm:/airtable/api_key}',
    AIRTABLE_PACKAGES_BASE: '${ssm:/airtable/packages_base}',
    AWS_DIST_BUCKET: '${ssm:AW5_S3_BUCKET}',
    ALGOLIA_APP_ID: '${ssm:/algolia/app_id}',
    ALGOLIA_SEARCH_API_KEY: '${ssm:/algolia/search_api_key}',
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        's3:GetBucketAcl',
        's3:List',
        's3:ListBucket',
        's3:PutObject'
      ],
      Resource: [
        "arn:aws:s3:::${ssm:AW5_S3_BUCKET}",
        "arn:aws:s3:::${ssm:AW5_S3_BUCKET}/*",
        "arn:aws:s3:::${ssm:AW5_S3_BUCKET}/*/*",
      ]
    }
  ]
};
