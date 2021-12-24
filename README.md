# strip-gh-theme-links

In Github you can specify the theme an is displayed to by appending
`#gh-dark-mode-only` or `#gh-dark-mode-only` to the end of an image
URL, in Markdown. See [Specifying the theme an image is shown
to][modes-docs].

However, other platforms currently do not support this syntax and will
display both versions of the image. So you might want to delete one of
the images before uploading your document to other platforms like,
for example, Packagist (PHP) or PyPI (Python).

This npm package and Github Action is for you. It strips all the unwanted
content about one of the theme versions from your files. Perfect for
running it before your packaging step in your release pipelines.

## Usage

### Programatically with Node.js

```bash
npm install strip-gh-theme-links
```

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

### As Github Action

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

[modes-docs]: https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to
