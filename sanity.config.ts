'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

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

const singletonTypes = new Set(SINGLETONS.map(singleton => singleton._type))
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: '/studio',
  title: 'Boilerplate CMS',
  projectId,
  dataset,
  schema: {
    types: schema
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
  ],
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
