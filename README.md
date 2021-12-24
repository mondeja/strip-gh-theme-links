# strip-gh-theme-links

In Github you can specify the theme an image is displayed to
by appending `#gh-light-mode-only` or `#gh-dark-mode-only` to
the end of an image URL, in Markdown. See [Specifying the
theme an image is shown to][modes-docs].

However, other platforms currently do not support this syntax
and will display both versions of the image. So you might want
to delete one of the images before uploading your documents to
other platforms like, for example, Packagist (PHP) or PyPI
(Python).

This npm package and Github Action is for you. It strips all
the unwanted content about one of the theme versions from your
files. Perfect for running it before your packaging step in
your release pipelines.

## Install

```bash
npm install strip-gh-theme-links
```

## Usage

### Node.js API

```javascript
const { stripGhThemeLinks } = require("strip-gh-theme-links");

const content = `
<p align="center>
  <img src="https://raw.githubusercontent.com/user/repo/assets/readme/logo-black.svg#gh-light-mode-only" alt="logo"> <img src="https://raw.githubusercontent.com/user/repo/assets/readme/logo-white.svg#gh-dark-mode-only" alt="logo">
</p>
`

console.log(stripGhThemeLinks(content, 'light'))
/* OUTPUT:
<p align="center>
  <img src="https://raw.githubusercontent.com/user/repo/assets/readme/logo-black.svg" alt="logo">
</p>
*/
```

#### Reference

<a name="stripGhThemeLinks" href="#stripGhThemeLinks">#</a>
<b>stripGhThemeLinks</b>(<i>content: string</i>,
<i>keep: 'light' | 'dark'</i>): <i>string</i>

- <a name="stripGhThemeLinks-content" href="#stripGhThemeLinks-content">#</a> <i>content</i> ⇒ Content for which the Github image theme links will be stripped.
- <a name="stripGhThemeLinks-keep" href="#stripGhThemeLinks-keep">#</a> <i>keep (default: 'light')</i> ⇒ Theme variant links to keep in the content.

### CLI

```bash
$ strip-gh-theme-links --help
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
        uses: actions/checkout@v2
      - name: Strip Github theme image links
        with:
          keep: light
          files: README.md
```

> :warning: It is recomended to run the [CLI](#cli) to check that your files are correctly stripped before configure this action in your release pipeline.
>
> If you experiments errors, please [report them][new-issue].

### Reference

#### Inputs

- <a name="input-files" href="#input-files">#</a> <b>files</b> ⇒
Path to files or globs to strip, separated by newlines.
- <a name="input-keep" href="#input-keep">#</a> <b>keep</b> (default: 'light') ⇒
Theme variant links to keep in the content of the files.

[modes-docs]: https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to
[new-issue]: https://github.com/mondeja/strip-gh-theme-links/issues/new
