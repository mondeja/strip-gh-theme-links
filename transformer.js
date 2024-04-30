import {load} from 'cheerio';
import {visit} from 'unist-util-visit';

const _normalizeHTMLSchemeAttribute = (html, scheme) => {
  return html.replace(
    new RegExp(`\\(prefers-color-scheme:\\s*${scheme}\\)`),
    `(prefers-color-scheme: ${scheme})`,
  );
};

const _normalizeHeadingInlineHtml = (ast) => {
  if (!ast.children) {
    return;
  }

  const currentPicture = {
    startIndex: null,
    endIndex: null,
    value: '',
  };

  for (const child of ast.children) {
    if (child.type === 'html') {
      if (child.value === '<picture>') {
        currentPicture.value = child.value;
        currentPicture.startIndex = ast.children.indexOf(child);
      } else if (child.value === '</picture>') {
        currentPicture.endIndex = ast.children.indexOf(child);
        currentPicture.value += child.value;
        ast.children = [
          ...ast.children.slice(0, currentPicture.startIndex),
          {
            type: 'html',
            value: currentPicture.value,
          },
          ...ast.children.slice(currentPicture.endIndex + 1),
        ];
        currentPicture.value = '';
        currentPicture.startIndex = null;
      } else if (currentPicture.value) {
        currentPicture.value += child.value;
      }
    } else if (child.children) {
      _normalizeHeadingInlineHtml(child);
    }
  }
};

const createHtmlBlockVisitor = (keep) => {
  return (node) => {
    let html;
    html = keep ? _normalizeHTMLSchemeAttribute(node.value, keep) : node.value;

    const regex = /<picture.*?>(.*?)<*.picture>/gs;
    const matches = html.match(regex);
    if (!matches) {
      return;
    }

    for (const match of matches) {
      const $ = load(match, null, false);

      let $img;
      let source;
      if (keep) {
        source = $(`source[media="(prefers-color-scheme: ${keep})"]`).attr(
          'srcset',
        );
        if (!source) {
          // Not a theme image
          continue;
        }

        $img = $(`img`);
        if (!$img) {
          // Not a theme image
          continue;
        }
      } else {
        $img = $('img');
        if (!$img) {
          // Not a theme image
          continue;
        }

        source = $img.attr('src');
        if (!source) {
          // Not a theme image
          continue;
        }
      }

      $img.attr('src', source);

      html = html.replace(match, $img.toString());
    }

    node.value = html;
  };
};

function createTransformer({keep}) {
  const visitHtmlBlock = createHtmlBlockVisitor(keep);

  function transformer(ast) {
    _normalizeHeadingInlineHtml(ast);
    visit(ast, visitor);

    function visitor(node) {
      if (node.type === 'html') {
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
