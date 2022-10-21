import { parse as parseHTML } from "node-html-parser";

const _normalizeHTMLSchemeAttr = (html: string, scheme: string): string => {
  return html.replace(
    new RegExp(`\\(prefers-color-scheme:\\s*${scheme}\\)`),
    `(prefers-color-scheme: ${scheme})`
  );
};

/**
 * @param content Content for which Github theme image links
 * will be stripped.
 * @param keep Theme variant links to keep in the content.
 * @returns Content with Github theme links stripped.
 */
export default function stripGhThemeLinks(
  content: string,
  keep?: "light" | "dark"
): string {
  const newContent = [],
    _currentPictureBlock = [];
  let _insidePictureBlock = false;

  for (let i = 0; i < content.length; i++) {
    if (!_insidePictureBlock) {
      if (content.substring(i, i + 9) === "<picture>") {
        _insidePictureBlock = true;
        _currentPictureBlock.push("<picture>");
        i += 8;
      } else {
        newContent.push(content[i]);
      }
    } else {
      if (content.substring(i, i + 10) === "</picture>") {
        _insidePictureBlock = false;
        _currentPictureBlock.push("</picture>");

        const _currentPictureBlockContent = _currentPictureBlock.join("");

        let src, pictureBlock;
        if (keep) {
          pictureBlock = parseHTML(
            _normalizeHTMLSchemeAttr(_currentPictureBlockContent, keep)
          );
          src = pictureBlock.querySelector(
            `source[media="(prefers-color-scheme: ${keep})"]`
          );
          if (!src) {
            // is not a theme image
            newContent.push(_currentPictureBlockContent);
            continue;
          } else {
            src = src.getAttribute("srcset");
          }
        } else {
          pictureBlock = parseHTML(_currentPictureBlockContent);
          src = pictureBlock.querySelector("img");
          if (!src) {
            // is not a theme image
            newContent.push(_currentPictureBlockContent);
            continue;
          } else {
            src = src.getAttribute("src");
          }
        }
        const img = pictureBlock.querySelector("img");

        newContent.push(`<img src="${src}"`);
        if (img) {
          for (const attr of img.rawAttrs.split(" ")) {
            if (!attr.startsWith("src=")) {
              newContent.push(` ${attr}`);
            }
          }
        }
        newContent.push(">");
        i += 9;
      } else {
        _currentPictureBlock.push(content[i]);
      }
    }
  }
  return newContent.join("");
}

const content = `
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

console.log(stripGhThemeLinks(content, "dark"));
