import S3 from 'aws-sdk/clients/s3';
import { compareVersions, validate } from 'compare-versions';
import _ from 'lodash';
import type { S3Package } from './types';

const Bucket = process.env.AWS_DIST_BUCKET;
const  s3 = new S3();

export const getAllS3Packages = async (): Promise<S3Package[]>  => {
  const allS3PackagesWithDups = await getKeysFromS3();

  const sortedByVersion = allS3PackagesWithDups
    .sort((a, b) => compareVersions(a.version, b.version))
    .reverse();

  const uniquePackages = _(sortedByVersion)
    .uniqBy('name')
    .value();

  return uniquePackages;
}

const getKeysFromS3 = async (ContinuationToken?: string) : Promise<S3Package[]> => {
  const res = await s3.listObjectsV2({
    Bucket,
    MaxKeys: 2147483647,
    ...(ContinuationToken ? { ContinuationToken } : {}),
  }).promise();

  const s3Packages: S3Package[] = res.Contents
    .filter((data: S3.Object) => data.Key.split('/').length >= 2)
    .map(convertS3ContentTOS3Package);

  if (res.IsTruncated && res.NextContinuationToken) {
    const nextPackages = await getKeysFromS3(res.NextContinuationToken);
    s3Packages.push(...nextPackages);
  }

  return s3Packages.filter((p) => validate(p.version));
}

const convertS3ContentTOS3Package = (data: S3.Object) : S3Package => {
  const pathElements = data.Key.replace('github.com/', '').split('/');
  const [rawVersion] = pathElements.pop().split('.tar');
  const version = rawVersion.replace('v', '')
    .replace('.sha256sum','')
    .replace('ersions.txt', '');

  const [maintainerOrPackageName, packageName] = pathElements;
  const isMaintainer = !packageName ? false :
    !['linux','darwin'].includes(packageName);

  const fullName = isMaintainer ? [maintainerOrPackageName, packageName].join('/') : maintainerOrPackageName;

  return {
    slug: fullName.replace(/[^\w\s]/gi, '_').toLocaleLowerCase(),
    name: isMaintainer ? packageName : maintainerOrPackageName,
    full_name: fullName,
    maintainer: isMaintainer ? maintainerOrPackageName : '',
    version,
    last_modified: data.LastModified,
    homepage: getPossibleHomepage(maintainerOrPackageName) || getPossibleHomepage(packageName) || '' 
  }
}

const getPossibleHomepage = (name: string) => {
  return name && name.split('.').length > 1 ? `https://${name}` : ''
}

export const writePackagesToS3 = async (packages: S3Package[]) => {
  console.log("uploading!")

  const buf = Buffer.from(JSON.stringify(packages));

  const data = {
      Bucket: 'dist.tea.xyz',
      Key: 'mock_packages.json',
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'application/json'
  };

  await s3.putObject(data).promise();
  console.log("uploaded!")
}