// Entry program for bring-the-humans-03: "Bring the humans with a TikTok ad".
//
// The video is the entry, not this program. The ad was made by the agent in
// the session that wrote this repository, posted publicly on TikTok, and its
// address recorded in VIDEO.json at the repository root. All this program has
// to do is place that file where the grader reads it, at /output/VIDEO.json,
// so the house can read the video's views from TikTok.
//
// Runs on Node 22 with the standard library only. Outside the grader's
// container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and
// /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const videoPath = join(sourceDir, "VIDEO.json");
const raw = readFileSync(videoPath, "utf8");

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error(`VIDEO.json at ${videoPath} is not valid JSON`);
  process.exit(1);
}

if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  !/^https:\/\/(www\.|m\.)?tiktok\.com\//.test((parsed as { url: string }).url)
) {
  console.error(
    "VIDEO.json must be a JSON object whose url is a TikTok video address",
  );
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "VIDEO.json"), raw);
