#!/usr/bin/env node
/**
 * Creates one singleton document per language (plus translation.metadata).
 *
 * Run via:
 *   pnpm create:singletons
 *
 * Or directly:
 *   pnpm exec sanity exec ./scripts/createSingletons.mjs --with-user-token
 */

import { getCliClient } from "sanity/cli";
import { SINGLETONS } from "../config/singletons/singletons";
import { LANGUAGES } from "../config/i18n/i18nConfig";

const client = getCliClient();

async function createSingletons() {
  const documents = SINGLETONS.flatMap((singleton) => {
    if (!singleton.localized) {
      return [
        {
          _id: singleton.id,
          _type: singleton._type,
        },
      ];
    }

    const translations = LANGUAGES.map((language) => ({
      _id: `${singleton.id}-${language.id}`,
      _type: singleton._type,
      language: language.id,
    }));

    const metadata = {
      _id: `${singleton.id}-translation-metadata`,
      _type: "translation.metadata",
      translations: translations.map((translation) => ({
        _key: translation.language,
        language: translation.language,
        value: {
          _type: "reference",
          _ref: translation._id,
        },
      })),
      schemaTypes: [...new Set(translations.map((translation) => translation._type))],
    };

    return [metadata, ...translations];
  });

  const transaction = client.transaction();

  documents.forEach((doc) => {
    transaction.createOrReplace(doc);
  });

  try {
    const res = await transaction.commit();
    console.log(res);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

createSingletons();
