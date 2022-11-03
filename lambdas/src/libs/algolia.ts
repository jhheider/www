import algoliasearch from 'algoliasearch';
import _ from 'lodash';

import type { AlgoliaIndexedPackage } from './types';

const appId = process.env.ALGOLIA_APP_ID;
const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

const client = algoliasearch(appId, searchApiKey);

const packagesIndex = client.initIndex('dev_packages');

export const getBestMatchingIndexedPackage = async (name: string): Promise<AlgoliaIndexedPackage | void> => {
    const { hits: [bestMatch] } = await packagesIndex.search(name);
    if (bestMatch) {
        /**
         * sample hit:
         *  {
                name: 'pyyaml',
                full_name: 'pyyaml',
                desc: 'YAML framework for Python',
                homepage: 'https://pyyaml.org',
                version: '6.0',
                objectID: 'pyyaml',
                _highlightResult: [Object]
            }
         */
        return {
            ..._.omit(bestMatch, ['_highlightResult']),
        } as unknown as AlgoliaIndexedPackage;
    }
}