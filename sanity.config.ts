'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { documentInternationalization, SupportedLanguages } from '@sanity/document-internationalization'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schema'
import {structure} from './sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { resolve } from './sanity/presentation'
import { SINGLETONS } from './config/singletons/singletons'
import { defaultLocale, LANGUAGES } from './config/i18n/i18nConfig'

const singletonTypes = new Set(SINGLETONS.map(singleton => singleton._type))
const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const localizedDocumentTypes = ['home', 'page', 'settings']

export default defineConfig({
  basePath: '/studio',
  title: 'Boilerplate Bilingual CMS',
  projectId,
  dataset,
  schema: {
    types: schema,
    templates: (prev) => [
      ...prev.filter((template) => !['page'].includes(template.id)),
      {
        id: 'page-es',
        title: 'Page (ES)',
        schemaType: 'page',
        value: {language: 'es'}
      },
      {
        id: 'page-en',
        title: 'Page (EN)',
        schemaType: 'page',
        value: {language: 'en'}
      },
    ],
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draftMode/enable',
        },
      },
      resolve,
    }),
    documentInternationalization({
      supportedLanguages: LANGUAGES as SupportedLanguages,
      schemaTypes: localizedDocumentTypes,
    }),
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: [defaultLocale],
      fieldTypes: ['string'],
    }),
  ],
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
