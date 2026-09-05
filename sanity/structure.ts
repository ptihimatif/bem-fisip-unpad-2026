import type {StructureResolver} from 'sanity/structure'
import {CABINET_PROFILE_ID} from './schemaTypes/cabinetProfile'
import {SITE_SETTINGS_ID} from './schemaTypes/siteSettings'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID)),
      S.listItem()
        .title('Cabinet Profile')
        .child(S.document().schemaType('cabinetProfile').documentId(CABINET_PROFILE_ID)),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['siteSettings', 'cabinetProfile'].includes(item.getId() ?? ''),
      ),
    ])
