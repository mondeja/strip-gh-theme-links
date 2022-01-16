const urlRe =
  "[\\w\\-./?:_%=&]+(?:#gh-(?:(?:light)|(?:dark))-mode-only)(?:[\\w\\-./?:_%=&]+)?";

const markdownInlineLinkRe = new RegExp(
  "(?:!?\\[(?:[^[\\]]|\\[[^\\]]*\\])*\\])\\(" +
    urlRe +
    "(?:\\s[\"\\']\\w+[\"\\'])?\\)",
  "g"
);

const markdownReferenceLinkRe = new RegExp(
  "\\s{0,3}\\[[^\\]]+]:\\s" + urlRe + "(?:\\s[\"']\\w+[\"'])?",
  "g"
);

const htmlTagRe = new RegExp(
  "<[a-zA-Z][^>]+=[\"']?" + urlRe + "[\"']?[^>]*\\/?>",
  "g"
);

const newLineRe = new RegExp("(\\r\\n|\\n|\\r)");
const emptyLineRe = new RegExp("^(\\r\\n|\\n|\\r)$");
const splitLinesRe = new RegExp("^.*((\\r\\n|\\n|\\r)|$)", "gm");

function _splitlines(content: string): string[] {
  return content.match(splitLinesRe) as Array<string>;
}

function _getEmptyLineNumbers(content: string) {
  return _splitlines(content)
    .map(function (line: string, i: number): null | number {
      return line.replace(newLineRe, "") ? null : i;
    })
    .filter((num) => num !== null);
}

export function stripLinks(
  content: string,
  expectedSubstringToKeep: string,
  expectedSubstringToStrip: string
): string {
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

  // call recursively until all the `gh-${theme}-mode-only` links
  // are stripped. This is easier to maintain than writing more complex
  // regexes to fulfill the matching multiple times in a line.
  if (transformed.length !== content.length) {
    return stripLinks(
      transformed,
      expectedSubstringToKeep,
      expectedSubstringToStrip
    );
  }
  return transformed;
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

  // strip new generated empty lines
  const lines = _splitlines(
      stripLinks(content, expectedSubstringToKeep, expectedSubstringToStrip)
    ),
    newLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (
      !emptyLineNumbers.includes(i) && // is not original empty line
      !lines[i].replace(emptyLineRe, "") // is a new empty line
    ) {
      if (!emptyLineNumbers.includes(i - 1)) {
        newLines[i - 1] = newLines[i - 1].replace(newLineRe, "");
      }
    } else {
      newLines.push(lines[i]);
    }
  }
  return newLines.join("");
}
