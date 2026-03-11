#!/usr/bin/env node
// ============================================================
// SEED SCRIPT — Reads card data from src/data/cards.ts and
// batch-writes to DynamoDB Card table via AWS SDK.
//
// Prerequisites:
//   npm install -D @aws-sdk/client-dynamodb
//   AWS credentials configured (aws configure or env vars)
//
// Usage:
//   node scripts/seed-cards.mjs
//
// This is a one-time migration tool. Run it before stripping
// card text from the frontend bundle.
// ============================================================

import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- CONFIG (override via env vars) ----
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Card-334wmsvuvbd7papdiwn6jsfgeq-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

// ---- Parse card data from the TypeScript source ----
// We read the raw file and extract card arrays using regex/manual parsing.
// This avoids needing a TS compiler for a one-time seed.

const cardsFilePath = resolve(__dirname, "../src/data/cards.ts");
const src = readFileSync(cardsFilePath, "utf-8");

/**
 * Extract an array literal from source by finding the variable declaration.
 * Returns parsed JSON (we do a small transform to handle TS syntax).
 */
function extractArray(varName) {
  // Find: const varName: Type[] = [  ...  ];
  const startPattern = new RegExp(`(?:const|let|var)\\s+${varName}[^=]*=\\s*\\[`);
  const match = startPattern.exec(src);
  if (!match) throw new Error(`Could not find array "${varName}" in cards.ts`);

  let depth = 0;
  let start = match.index + match[0].length - 1; // position of [
  let end = start;

  for (let i = start; i < src.length; i++) {
    if (src[i] === "[") depth++;
    if (src[i] === "]") depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }

  let raw = src.slice(start, end);

  // Transform to valid JSON:
  // 1. Remove trailing commas before ] or }
  raw = raw.replace(/,(\s*[}\]])/g, "$1");
  // 2. Add quotes around unquoted keys:  key: -> "key":
  raw = raw.replace(/(\{[\s\n]*|,[\s\n]*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
  // 3. Replace single quotes with double quotes
  raw = raw.replace(/'/g, '"');
  // 4. Handle `as const` type assertions
  raw = raw.replace(/\s+as\s+const/g, "");
  // 5. Handle template literals that may exist (none expected, but safety)
  // 6. Remove line comments
  raw = raw.replace(/\/\/[^\n]*/g, "");
  // 7. Remove TS type casts like `"text" as const`
  raw = raw.replace(/("[\w-]+")(\s+as\s+"?\w+"?)/g, "$1");

  try {
    return JSON.parse(raw);
  } catch (e) {
    // Debug: write the problematic JSON to a temp file
    const { writeFileSync } = await import("fs");
    writeFileSync("/tmp/seed-debug.json", raw);
    throw new Error(`Failed to parse "${varName}": ${e.message}\nDebug written to /tmp/seed-debug.json`);
  }
}

/**
 * Extract the extraTexts string array and generate extraTextCards
 */
function extractExtraTextCards() {
  // Find the extraTexts array
  const startPattern = /const\s+extraTexts\s*:\s*string\[\]\s*=\s*\[/;
  const match = startPattern.exec(src);
  if (!match) throw new Error("Could not find extraTexts array");

  let depth = 0;
  let start = match.index + match[0].length - 1;
  let end = start;

  for (let i = start; i < src.length; i++) {
    if (src[i] === "[") depth++;
    if (src[i] === "]") depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }

  let raw = src.slice(start, end);
  raw = raw.replace(/,(\s*\])/g, "$1");
  raw = raw.replace(/\/\/[^\n]*/g, "");

  const texts = JSON.parse(raw);
  const EXTRA_TAGS = ["lonely", "stressed", "doubting", "laugh", "overstimulated"];

  return texts.map((text, i) => {
    const tag = EXTRA_TAGS[i % EXTRA_TAGS.length];
    return {
      id: `extra-${String(i + 1).padStart(3, "0")}`,
      type: "text",
      category: "sweet",
      intensity: 1,
      rarity: "common",
      emoji: "💝",
      tags: [tag],
      text,
    };
  });
}

// ---- Build the complete card list ----
console.log("Parsing card data from src/data/cards.ts ...");

const textCards = extractArray("textCards");
const voucherCards = extractArray("voucherCards");
const playlistCards = extractArray("playlistCards");

// Extract mini-compliments (they're a separate array within textCards scope)
// Actually, looking at the file, there may be inline arrays. Let's check.
let extraTextCards = [];
try {
  extraTextCards = extractExtraTextCards();
} catch (e) {
  console.warn("Could not extract extra text cards:", e.message);
}

const allCards = [...textCards, ...voucherCards, ...playlistCards, ...extraTextCards];
console.log(`Found ${allCards.length} cards total:`);
console.log(`  Text: ${textCards.length}`);
console.log(`  Voucher: ${voucherCards.length}`);
console.log(`  Playlist: ${playlistCards.length}`);
console.log(`  Extra text: ${extraTextCards.length}`);

// ---- Convert to DynamoDB item format ----
function toDynamoItem(card) {
  const now = new Date().toISOString();
  const item = {
    id: { S: card.id },
    type: { S: card.type },
    text: { S: card.text || "" },
    category: { S: card.category },
    createdAt: { S: now },
    updatedAt: { S: now },
    __typename: { S: "Card" },
  };

  if (card.emoji) item.emoji = { S: card.emoji };
  if (card.rarity) item.rarity = { S: card.rarity };
  if (card.intensity != null) item.intensity = { N: String(card.intensity) };
  if (card.tags && card.tags.length > 0) item.tags = { L: card.tags.map(t => ({ S: t })) };
  if (card.subCategory) item.subCategory = { S: card.subCategory };

  // Voucher fields
  if (card.title) item.title = { S: card.title };
  if (card.options && card.options.length > 0) item.options = { L: card.options.map(o => ({ S: o })) };

  // Playlist fields
  if (card.songTitle) item.songTitle = { S: card.songTitle };
  if (card.artist) item.artist = { S: card.artist };
  if (card.link) item.link = { S: card.link };

  return item;
}

// ---- Batch write to DynamoDB ----
const client = new DynamoDBClient({ region: REGION });

// DynamoDB BatchWriteItem accepts max 25 items per batch
async function batchWrite(items) {
  const BATCH_SIZE = 25;
  let written = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const putRequests = batch.map(card => ({
      PutRequest: { Item: toDynamoItem(card) },
    }));

    const command = new BatchWriteItemCommand({
      RequestItems: { [TABLE_NAME]: putRequests },
    });

    let response = await client.send(command);

    // Handle unprocessed items (throttling)
    let retries = 0;
    while (response.UnprocessedItems?.[TABLE_NAME]?.length > 0 && retries < 5) {
      retries++;
      const delay = Math.pow(2, retries) * 100;
      console.log(`  Retrying ${response.UnprocessedItems[TABLE_NAME].length} unprocessed items (attempt ${retries})...`);
      await new Promise(r => setTimeout(r, delay));
      response = await client.send(new BatchWriteItemCommand({
        RequestItems: { [TABLE_NAME]: response.UnprocessedItems[TABLE_NAME] },
      }));
    }

    written += batch.length;
    process.stdout.write(`\r  Writing cards... ${written}/${items.length}`);
  }

  console.log("\n");
}

console.log(`\nSeeding ${allCards.length} cards to DynamoDB table "${TABLE_NAME}" ...`);
await batchWrite(allCards);
console.log("Seed complete! All cards written to DynamoDB.");
