const urlRe =
  /[\w\-./?:_%=&]+(?:#gh-(?:(?:light)|(?:dark))-mode-only)(?:[\w\-./?:_%=&]+)?/;

const markdownInlineLinkRe = new RegExp(
  /(?:!?\[(?:[^[\]]|\[[^\]]*\])*\])\(/.source +
    urlRe.source +
    /(?:\s["']\w+["'])?\)/.source,
  "g"
);

const markdownReferenceLinkRe = new RegExp(
  /\s{0,3}\[[^\]]+]:\s/.source + urlRe.source + /(?:\s["']\w+["'])?/.source,
  "g"
);

const htmlTagRe = new RegExp(
  /<[a-zA-Z][^>]+=["']?/.source + urlRe.source + /["']?[^>]*\/?>/.source,
  "g"
);

function _splitlines(content: string): string[] {
  return content.match(/^.*((\r\n|\n|\r)|$)/gm) as Array<string>;
}

function _getEmptyLineNumbers(content: string) {
  return _splitlines(content)
    .map(function (line: string, i: number): null | number {
      return line.replace(/(\r\n|\n|\r)/, "") ? null : i;
    })
    .filter((num) => num !== null);
}

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

  // store empty line numbers from original content
  const emptyLineNumbers = _getEmptyLineNumbers(content);

  function stripLinks(partialContent: string): string {
    function replacer(match: string): string {
      return match.includes(expectedSubstringToKeep)
        ? match.replace(expectedSubstringToKeep, "")
        : // only strip if includes the substring for other theme
        match.includes(expectedSubstringToStrip)
        ? ""
        : match.replace(expectedSubstringToKeep, "");
    }

    const transformed = partialContent
      .replace(markdownInlineLinkRe, replacer)
      .replace(markdownReferenceLinkRe, replacer)
      .replace(htmlTagRe, replacer);

    // call recursively until all the `gh-${theme}-mode-only` links
    // are stripped. This is easier to maintain than writing more complex
    // regexes to fulfill the matching multiple times in a line.
    if (transformed.length !== partialContent.length) {
      return stripLinks(transformed);
    }
    return transformed;
  }

  // strip new generated empty lines
  const lines = _splitlines(stripLinks(content)),
    newLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (
      !emptyLineNumbers.includes(i) && // is not original empty line
      !lines[i].replace(/^(\r\n|\n|\r)$/, "") // is a new empty line
    ) {
      if (!emptyLineNumbers.includes(i - 1)) {
        newLines[i - 1] = newLines[i - 1].replace(/(\r\n|\n|\r)/, "");
      }
    } else {
      newLines.push(lines[i]);
    }
  }
  return newLines.join("");
}
