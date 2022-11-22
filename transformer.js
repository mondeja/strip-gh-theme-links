import { visit } from "unist-util-visit";
import { load } from "cheerio";

const _normalizeHTMLSchemeAttr = (html, scheme) => {
  return html.replace(
    new RegExp(`\\(prefers-color-scheme:\\s*${scheme}\\)`),
    `(prefers-color-scheme: ${scheme})`
  );
};

const _normalizeHeadingInlineHtml = (ast) => {
  if (!ast.children) {
    return;
  }

  const currPicture = {
    startIndex: null,
    endIndex: null,
    value: "",
  };

  for (let child of ast.children) {
    if (child.type === "html") {
      if (child.value === "<picture>") {
        currPicture.value = child.value;
        currPicture.startIndex = ast.children.indexOf(child);
      } else if (child.value === "</picture>") {
        currPicture.endIndex = ast.children.indexOf(child);
        currPicture.value += child.value;
        ast.children = [
          ...ast.children.slice(0, currPicture.startIndex),
          {
            type: "html",
            value: currPicture.value,
          },
          ...ast.children.slice(currPicture.endIndex + 1),
        ];
        currPicture.value = "";
        currPicture.startIndex = null;
      } else if (currPicture.value) {
        currPicture.value += child.value;
      }
    } else if (child.children) {
      _normalizeHeadingInlineHtml(child);
    }
  }
};

const createHtmlBlockVisitor = (keep) => {
  return (node) => {
    let html;
    if (keep) {
      html = _normalizeHTMLSchemeAttr(node.value, keep);
    } else {
      html = node.value;
    }

    const regex = /<picture>(?!<\/picture>).+/gs;
    const matches = html.match(regex);
    if (!matches) {
      return;
    }

    for (let match of matches) {
      const $ = load(match, null, false);

      let $img, src;
      if (keep) {
        src = $(`source[media="(prefers-color-scheme: ${keep})"]`).attr(
          "srcset"
        );
        if (!src) {
          // not a theme image
          continue;
        }
        $img = $(`img`);
        if (!$img) {
          // not a theme image
          continue;
        }
      } else {
        $img = $("img");
        if (!$img) {
          // not a theme image
          continue;
        }

        src = $img.attr("src");
        if (!src) {
          // not a theme image
          continue;
        }
      }

      $img.attr("src", src);

      html = html.replace(match, $img.toString());
    }

    node.value = html;
  };
};

function createTransformer({ keep }) {
  const visitHtmlBlock = createHtmlBlockVisitor(keep);

  function transformer(ast) {
    _normalizeHeadingInlineHtml(ast);
    visit(ast, visitor);

    function visitor(node) {
      if (node.type === "html") {
        visitHtmlBlock(node);
      }
      return node;
    }
  }

  return transformer;
}

export default function plugin(options) {
  return createTransformer(options);
}
