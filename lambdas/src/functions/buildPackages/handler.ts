import type { Package, AirtablePackage, S3Package } from '@libs/types';
import _ from 'lodash';

import { getAllS3Packages, writePackagesToS3 } from '@libs/dist_tea_xyz';
import { getAllAirtablePackages, insertPackagesToAirtable } from '@libs/airtable';
import { getBestMatchingIndexedPackage } from '@libs/algolia';

type NewAirtablePackage = Partial<AirtablePackage>;


const buildPackages = async () => {
  try {
    const [
      allS3Packages,
      airtablePackages
    ] = await Promise.all([
      getAllS3Packages(),
      getAllAirtablePackages(),
    ]);

    const {
      newPackages,
      packagesJson,
    } = await getFinalPackagesData(allS3Packages, airtablePackages);

    await Promise.all([
      insertPackagesToAirtable(newPackages),
      writePackagesToS3(packagesJson),
    ]);
  } catch (error) {
    console.error(error);
  }
};

interface FinalPackageOutput {
  newPackages: NewAirtablePackage[],
  packagesJson: Package[],
}
interface AirtablePackageDict {
  [slug: string]: AirtablePackage
}
const placeholderThumbImg = '/Images/package-thumb-nolabel4.jpg';
const getFinalPackagesData = async (s3Packages: S3Package[], airtablePackages: AirtablePackage[]): Promise<FinalPackageOutput> => {
  const newPackages: NewAirtablePackage[] = [];
  const packagesJson: Package[] = [];

  const airtablePackagesDict: AirtablePackageDict = airtablePackages.reduce(
    (dict: AirtablePackageDict, p: AirtablePackage) => {
      dict[p.slug] = p;
      return dict;
    },
    {}
  );

  for(const s3Package of s3Packages) {
    const airtablePackage = airtablePackagesDict[s3Package.slug];
    if (airtablePackage) {
      const finalPackage: Package = {
        ...airtablePackage,
        installs: 0, // temporary get this from tea db/ipfs eventually
        thumb_image_url: airtablePackage.thumb_image_url || placeholderThumbImg,
      }
      packagesJson.push(finalPackage);
    } else {
      const matchingIndexedPackage = await getBestMatchingIndexedPackage(s3Package.full_name);
      const desc = matchingIndexedPackage ? matchingIndexedPackage.desc : '';
      const homepage = s3Package.homepage ||  _.get(matchingIndexedPackage, 'homepage', '');
      
      const newPackage: NewAirtablePackage = {
        ...s3Package,
        desc,
        homepage,
      }
      const tempPackage: Package = {
        ...s3Package,
        homepage,
        desc,
        installs: 0, // TODO: get from algolia
        dl_count: 0,
        thumb_image_url: placeholderThumbImg,
      }
      newPackages.push(newPackage);
      packagesJson.push(tempPackage);
    }
  }

  return {
    newPackages,
    packagesJson,
  }
}

export const main = buildPackages;
