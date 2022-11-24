import { remark } from "remark";
import remarkStripGhThemeLinks from "./transformer.js";

/**
 * @typedef {"light" | "dark"} keepType
 */

/**
 *
 * @param {string} content Markdown content from which to strip GH theme image links
 * @param {keepType} [keep] Which theme links to keep
 * @returns {Promise<string>} Stripped content
 */
export default async function stripGhThemeLinks(content, keep) {
  const file = await remark()
    .use(remarkStripGhThemeLinks, { keep })
    .process(content);
  return String(file);
}
