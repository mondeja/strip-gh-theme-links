# strip-gh-theme-links

In Github you can specify the theme an image is displayed to
by using `<picture>` HTML blocks in Markdown. See [Specifying the
theme an image is shown to][modes-docs].

However, other platforms currently do not support this tag
and will display both versions of the image. So you might want
to delete one of the images before uploading your documents to
other platforms like, for example, Packagist (PHP) or PyPI
(Python).

These npm package, CLI and Github Action are for you. They strip
all the image theme links about one of the Github theme versions
from your files. Perfect for running it before your packaging step
in your release pipelines.

> **Note**\
> The latest version supporting the deprecated `#gh-dark-mode-only`
> and `#gh-light-mode-only` hashes in inline images is
> [v3](https://github.com/mondeja/strip-gh-theme-links/releases/tag/v3).

## Install

```sh
npm install strip-gh-theme-links
```

## Usage

### Node.js

```javascript
import stripGhThemeLinks from "strip-gh-theme-links";

const content = `
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

console.log(await stripGhThemeLinks(content, "light"));
/* OUTPUT:
<img src="https://user-images.githubusercontent.com/light" alt="Alt text" title="Title text" width="70">
*/

console.log(await stripGhThemeLinks(content, "dark"));
/* OUTPUT:
<img src="https://user-images.githubusercontent.com/dark" alt="Alt text" title="Title text" width="70">
*/

console.log(await stripGhThemeLinks(content));
/* OUTPUT:
<img src="https://user-images.githubusercontent.com/default" alt="Alt text" title="Title text" width="70">
*/
```

#### Reference

<a name="stripGhThemeLinks" href="#stripGhThemeLinks">#</a>
**stripGhThemeLinks**(_content: string_,
_keep?: 'light' | 'dark'_): _Promise\<string\>_

- <a name="stripGhThemeLinks-content" href="#stripGhThemeLinks-content">#</a>
  _content_ ⇒ Content for which the Github theme image links will be
  stripped.
- <a name="stripGhThemeLinks-keep" href="#stripGhThemeLinks-keep">#</a>
  _keep_ ⇒ Theme variant links to keep in the content. If not specified the `src` attribute of the `<img>` tag will be used.

### CLI

```sh
strip-gh-theme-links --help
```

### Github Action

```yaml
name: Release
on:
  workflow_dispatch:

jobs:
  release-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Strip Github theme image links
        uses: mondeja/strip-gh-theme-links@v5
        with:
          files: |
            README.md
            CONTRIBUTING.md
```

> **Warning**\
> It is recomended to run the [CLI](#cli) with
> `strip-gh-theme-links --diff file.md` to check that your files are
> correctly stripped before configure this action in your release
> pipeline.

#### Reference

##### Inputs

- <a name="input-files" href="#input-files">#</a> **files**
  (required) ⇒ Path to files or globs to strip, separated by newlines.
- <a name="input-keep" href="#input-keep">#</a> **keep**
  ⇒ Theme variant links to keep in the content of the files.
- <a name="input-strict" href="#input-strict">#</a> **strict**
  (default: `false`) ⇒ Treat warnings as errors and exit with code 1.
  Warnings are raised when a file specified in
  [`files` input](#input-files) is not found or when no image links
  are stripped from a file.

[modes-docs]: https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to
