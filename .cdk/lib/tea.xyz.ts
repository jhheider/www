import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_s3_deployment as s3Deployment,
  Stack,
  StackProps,
  RemovalPolicy,
  CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import fs from "fs";

/**
 * The CloudFormation stack holding all our resources
 */
export default class TeaXYZ extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * The S3 Bucket hosting our build
     */
    const bucket = new s3.Bucket(this, "Bucket", {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    console.log("BUCKET NAME:", bucket.bucketName)
    fs.writeFile('../bucket.txt', bucket.bucketName, () => {
      console.log('bucket name shared');
    })

    const edgeLambda = lambda.Version.fromVersionArn(this, "Lambda", "arn:aws:lambda:us-east-1:640264234305:function:www-redirect:10");

    /**
     * The CloudFront distribution caching and proxying our requests to our bucket
     */
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: edgeLambda,
          },
        ],
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: "/404.html"
        },
      ],
    });

    /**
     * Output the distribution's url so we can pass it to external systems
     */
    new CfnOutput(this, "DeploymentUrl", {
      value: "https://" + distribution.distributionDomainName
    });

    /**
     * Upload our build to the bucket and invalidate the distribution's cache
     */
    new s3Deployment.BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [s3Deployment.Source.asset('../public')],
    });
  }
}