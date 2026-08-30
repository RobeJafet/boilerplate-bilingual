#!/usr/bin/env node
/**
 * Creates one singleton document per entry in SINGLETONS.
 *
 * Run via:
 *   pnpm create:singletons
 *
 * Or directly:
 *   pnpm exec sanity exec ./scripts/createSingletons.mjs --with-user-token
 */

import { getCliClient } from "sanity/cli";
import { SINGLETONS } from "../config/singletons/singletons";

const client = getCliClient();

async function createSingletons() {
  const documents = SINGLETONS.map((singleton) => ({
    _id: singleton.id,
    _type: singleton._type,
  }));

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
