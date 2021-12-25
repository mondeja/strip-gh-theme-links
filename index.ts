const urlRe =
  /[\w\-./?:_%=&]+(?:#gh-(?:(?:light)|(?:dark))-mode-only)(?:[\w\-./?:_%=&]+)?/;

const markdownInlineLinkRe = new RegExp(
  /(?:!?\[(?:[^[\]]|\[[^\]]*\])*\])\(/.source +
    urlRe.source +
    /(?:\s["']\w+["'])?\)/.source,
  "g"
);

const markdownReferenceLinkRe = new RegExp(
  /^\s{0,3}\[[^\]]+]:\s/.source +
    urlRe.source +
    /(?:\s["']\w+["'])?\s*$/.source,
  "gm"
);

const htmlTagRe = new RegExp(
  /<[a-zA-Z][^>]+=["']/.source + urlRe.source + /["'][^<]*\/?>/.source,
  "g"
);

/**
 * @param content Content for which Github theme image links
 * will be stripped.
 * @param keep Theme variant links to keep in the content.
 * @returns Content with Github theme links stripped.
 */
export default function stripGhThemeLinks(
  content: string,
  keep: "light" | "dark"
): string {
  const expectedSubstringToKeep = `#gh-${keep}-mode-only`,
    expectedSubstringToStrip = `#gh-${
      keep === "dark" ? "light" : "dark"
    }-mode-only`;

  function replacer(match: string): string {
    return match.includes(expectedSubstringToKeep)
      ? match.replace(expectedSubstringToKeep, "")
      : // only strip if includes the substring for other theme
      match.includes(expectedSubstringToStrip)
      ? ""
      : match.replace(expectedSubstringToKeep, "");
  }

  const transformed = content
    .replace(markdownInlineLinkRe, replacer)
    .replace(markdownReferenceLinkRe, replacer)
    .replace(htmlTagRe, replacer);

  // Recursively call until all the `gh-${theme}-mode-only` links
  // are stripped. This is easier to maintain than writing more complex
  // regexes to fulfill the matching multiple times in a line.
  if (transformed.length !== content.length) {
    return stripGhThemeLinks(transformed, keep);
  }
  return transformed;
}
