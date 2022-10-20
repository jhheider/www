import { base, FieldSet } from 'airtable';
import _ from 'lodash';
import type { AirtablePackage } from './types';


const airtablePackagesBase = base(process.env.AIRTABLE_PACKAGES_BASE);


export const getAllAirtablePackages = async (): Promise<AirtablePackage[]> => {
  const allRecords = await airtablePackagesBase('packages')
    .select({
      maxRecords: 100,
      view: '_api'
    }).all();

  const packages: AirtablePackage[] = allRecords.map((record) => {
    return {
      airtable_record_id: record.id,
      ..._.pick(record.fields, [
        'slug',
        'homepage',
        'maintainer',
        'name',
        'version',
        'last_modified',
        'full_name',
      ]),
      maintainer: record.fields?.maintainer || '',
      desc: record.fields?.desc || '',
      thumb_image_url: _.get(record.fields, 'thumb_image[0].url', '/Images/package-thumb-nolabel3.jpg')
    } as AirtablePackage;
  });
  /**
   * // SAMPLE RECORD SHAPE w/ thumb_image is uploaded
       {
      slug: 'unicode_org',
      name: 'unicode.org',
      full_name: 'unicode.org',
      homepage: 'https://unicode.org',
      version: '71.1.1',
      last_modified: '2022-09-26T19:46:25.000Z',
      thumb_image: [
          {
          id: 'attQVgaRUXOYinsWy',
          width: 640,
          height: 534,
          url: 'https://dl.airtable.com/.attachments/f2465c36a0060919368e2f53305694f9/cfab76a8/gen-art-1.png',
          filename: 'gen-art-1.png',
          size: 184878,
          type: 'image/png',
          thumbnails: [Object]
          }
      ]
      }
  TODO IMAGE UPLOAD to S3/CDN:
      if thumb_image_url is empty
      get thumb_image data
      upload to s3
      update thumb_image_url in airtable
      */
  return packages;
}

type NewPackageRecord = {
  fields: Partial<FieldSet>
}

export const insertPackagesToAirtable = async (newPackages: Partial<AirtablePackage>[]) => {
  console.log(`airtable: inserting new packages(${newPackages.length})`);
  try {
    const newRecords: NewPackageRecord[] = newPackages.map((fields) => {
      return {
        fields: {
          ...fields,
          last_modified: fields.last_modified.toString(),
        }
      }
    });

    // airtable can only insert 10 at a time
    const insertBatches = _.chunk(newRecords, 10);
    for(const batch of insertBatches) {
      await airtablePackagesBase('packages').create(batch);
    }
    console.info(`airtable: new packages(${newPackages.length}) inserted`)
  } catch (error) {
    console.error(error);
    console.log(`airtable: failed to insert packages(${newPackages.length})!`);
  }
}