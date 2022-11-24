import { remark } from "remark";
import remarkStripGhThemeLinks from "./transformer.js";

export default async function stripGhThemeLinks(content, keep) {
  const file = await remark()
    .use(remarkStripGhThemeLinks, { keep })
    .process(content);
  return String(file);
}
