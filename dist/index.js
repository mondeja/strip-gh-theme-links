"use strict";
exports.__esModule = true;
var node_html_parser_1 = require("node-html-parser");
var _normalizeHTMLSchemeAttr = function (html, scheme) {
    return html.replace(new RegExp("\\(prefers-color-scheme:\\s*".concat(scheme, "\\)")), "(prefers-color-scheme: ".concat(scheme, ")"));
};
/**
 * @param content Content for which Github theme image links
 * will be stripped.
 * @param keep Theme variant links to keep in the content.
 * @returns Content with Github theme links stripped.
 */
function stripGhThemeLinks(content, keep) {
    var newContent = [], _currentPictureBlock = [];
    var _insidePictureBlock = false;
    for (var i = 0; i < content.length; i++) {
        if (!_insidePictureBlock) {
            if (content.substring(i, i + 9) === "<picture>") {
                _insidePictureBlock = true;
                _currentPictureBlock.push("<picture>");
                i += 8;
            }
            else {
                newContent.push(content[i]);
            }
        }
        else {
            if (content.substring(i, i + 10) === "</picture>") {
                _insidePictureBlock = false;
                _currentPictureBlock.push("</picture>");
                var _currentPictureBlockContent = _currentPictureBlock.join("");
                var src = void 0, pictureBlock = void 0;
                if (keep) {
                    pictureBlock = (0, node_html_parser_1.parse)(_normalizeHTMLSchemeAttr(_currentPictureBlockContent, keep));
                    src = pictureBlock.querySelector("source[media=\"(prefers-color-scheme: ".concat(keep, ")\"]"));
                    if (!src) {
                        // is not a theme image
                        newContent.push(_currentPictureBlockContent);
                        continue;
                    }
                    else {
                        src = src.getAttribute("srcset");
                    }
                }
                else {
                    pictureBlock = (0, node_html_parser_1.parse)(_currentPictureBlockContent);
                    src = pictureBlock.querySelector("img");
                    if (!src) {
                        // is not a theme image
                        newContent.push(_currentPictureBlockContent);
                        continue;
                    }
                    else {
                        src = src.getAttribute("src");
                    }
                }
                var img = pictureBlock.querySelector("img");
                newContent.push("<img src=\"".concat(src, "\""));
                if (img) {
                    for (var _i = 0, _a = img.rawAttrs.split(" "); _i < _a.length; _i++) {
                        var attr = _a[_i];
                        if (!attr.startsWith("src=")) {
                            newContent.push(" ".concat(attr));
                        }
                    }
                }
                newContent.push(">");
                i += 9;
            }
            else {
                _currentPictureBlock.push(content[i]);
            }
        }
    }
    return newContent.join("");
}
exports["default"] = stripGhThemeLinks;
