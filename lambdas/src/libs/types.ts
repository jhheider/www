export interface S3Package {
  slug: string,
  version: string,
  full_name: string,
  name: string,
  maintainer: string,
  homepage: string,
  // key: string,
  last_modified: Date | string,
}

export type AirtablePackage = S3Package & {
  airtable_record_id: string,
  thumb_image_url: string,
  desc: string,
}

export type Package = Omit<AirtablePackage, 'airtable_record_id'> & {
  airtable_record_id?: string,
  installs: number,
}

export type AlgoliaIndexedPackage = Omit<S3Package, 'slug | maintainer | last_modified'> & {
  objectID: string;
  desc: string;
}