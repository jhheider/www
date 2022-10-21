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
        'dl_count',
      ]),
      maintainer: record.fields?.maintainer || '',
      desc: record.fields?.desc || '',
      thumb_image_url: _.get(record.fields, 'thumb_image[0].url', '/Images/package-thumb-nolabel3.jpg')
    } as AirtablePackage;
  });
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
          dl_count: 0,
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