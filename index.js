// @ts-nocheck

const urlRe =
  /[\w\-./?:_%=&]+(?:#gh-(?:(?:light)|(?:dark))-mode-only)(?:[\w\-./?:_%=&]+)?/;

const markdownInlineLinkRe = new RegExp(
  /(?:!\[(?:[^[\]]|\[[^\]]*\])*\])\(/.source +
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
  /<[a-zA-Z].+=["']/.source + urlRe.source + /["'].*\/?>/.source,
  "g"
);

/* TODO:
  - Multiple in same line for inline Markdown and HTML.
  - Strip empty lines.
*/

module.exports.stripGhThemeLinks = function (content, keep) {
  const expectedSubstringToKeep = `#gh-${keep}-mode-only`,
    expectedSubstringToStrip = `#gh-${
      keep === "dark" ? "light" : "dark"
    }-mode-only`;

  function replacer(match) {
    return match.includes(expectedSubstringToKeep)
      ? match.replace(expectedSubstringToKeep, "")
      : // only strip if includes the substring for other theme
      match.includes(expectedSubstringToStrip)
      ? ""
      : match.replace(expectedSubstringToKeep, "");
  }

  return content
    .replace(markdownInlineLinkRe, replacer)
    .replace(markdownReferenceLinkRe, replacer)
    .replace(htmlTagRe, replacer);
};
