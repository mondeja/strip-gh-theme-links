import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkStripGhThemeLinks from "./transformer.js";

export default async function stripGhThemeLinks(content, keep) {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkStripGhThemeLinks, { keep })
    .process(content);
  return String(file);
}
