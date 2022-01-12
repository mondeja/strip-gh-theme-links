/*import * as fs from "fs";
import * as path from "path";*/
import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../../index";

test("Simple Icons README strip", () => {
  /*
  const siReadmeFilePath = path.resolve(
    __dirname,
    "../../node_modules/simple-icons/README.md"
  );
  const siReadme = fs.readFileSync(siReadmeFilePath, "utf8");
  */
  const siReadme = `<p align="center">
<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg#gh-light-mode-only" alt="Simple Icons" width=70><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/simpleicons-white.svg#gh-dark-mode-only" alt="Simple Icons" width=70>
<h3 align="center">Simple Icons</h3>
<p align="center">
Over 2100 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>

<p align="center">
<a href="https://github.com/simple-icons/simple-icons/actions?query=workflow%3AVerify+branch%3Adevelop"><img src="https://img.shields.io/github/workflow/status/simple-icons/simple-icons/Verify/develop?logo=github" alt="Build status"/></a>
<a href="https://www.npmjs.com/package/simple-icons"><img src="https://img.shields.io/npm/v/simple-icons.svg?logo=npm" alt="NPM version"/></a>
<a href="https://packagist.org/packages/simple-icons/simple-icons"><img src="https://img.shields.io/packagist/v/simple-icons/simple-icons?logo=packagist&logoColor=white" alt="Build status"/></a>
</p>

## Usage

> :information_source: We ask that all users read our [legal disclaimer](./DISCLAIMER.md) before using icons from Simple Icons.

### General Usage

Icons can be downloaded as SVGs directly from [our website](https://simpleicons.org/) - simply click the icon you want, and the download should start automatically.

### CDN Usage

Icons can be served from a CDN such as [JSDelivr](https://www.jsdelivr.com/package/npm/simple-icons) or [Unpkg](https://unpkg.com/browse/simple-icons/). Simply use the \`simple-icons\` npm package and specify a version in the URL like the following:

\`\`\`html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/[ICON SLUG].svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v6/icons/[ICON SLUG].svg" />
\`\`\`

Where \`[ICON SLUG]\` is replaced by the [slug] of the icon you want to use, for example:

\`\`\`html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/simpleicons.svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v6/icons/simpleicons.svg" />
\`\`\`

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use \`@latest\` instead to receive updates indefinitely. However, this will result in a \`404\` error if the icon is removed.

### Node Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg#gh-light-mode-only" alt="Node" align=left width=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/nodedotjs-white.svg#gh-dark-mode-only" alt="Node" align=left width=24>

The icons are also available through our npm package. To install, simply run:

\`\`\`shell
npm install simple-icons
\`\`\`

The API can then be used as follows, where \`[ICON SLUG]\` is replaced by a [slug]:

\`\`\`javascript
const simpleIcons = require('simple-icons');

// Get a specific icon by its slug as:
// simpleIcons.Get('[ICON SLUG]');

// For example:
const icon = simpleIcons.Get('simpleicons');

\`\`\`

Alternatively, you can also import all icons from a single file, where \`[ICON SLUG]\` is replaced by a capitalized [slug]. We highly recommend using a bundler that can tree shake such as [webpack](https://webpack.js.org/) to remove the unused icon code:
\`\`\`javascript
// Import a specific icon by its slug as:
// import { si[ICON SLUG] } from 'simple-icons/icons'

// For example:
// use import/esm to allow tree shaking
import { siSimpleicons } from 'simple-icons/icons'
\`\`\`

> :warning: The old way of importing with \`require('simple-icons/icons/[ICON SLUG]')\` is deprecated and
will be removed in v7.0.0.

Either method will return an icon object:

\`\`\`javascript
console.log(icon);

/*
{
    title: 'Simple Icons',
    slug: 'simpleicons',
    hex: '111111',
    source: 'https://simpleicons.org/',
    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>',
    path: 'M12 12v-1.5c-2.484 ...',
    guidelines: 'https://simpleicons.org/styleguide',
    license: {
        type: '...',
        url: 'https://example.com/'
    }
}

NOTE: the \`guidelines\` entry will be \`undefined\` if we do not yet have guidelines for the icon.
NOTE: the \`license\` entry will be \`undefined\` if we do not yet have license data for the icon.
*/
\`\`\`

Lastly, the \`simpleIcons\` object is also enumerable.
This is useful if you want to do a computation on every icon:

\`\`\`javascript
const simpleIcons = require('simple-icons');

for (const iconSlug in simpleIcons) {
  const icon = simpleIcons.Get(iconSlug);
  // do stuff
}
\`\`\`

#### TypeScript Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg#gh-light-mode-only" alt="Typescript" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/typescript-white.svg#gh-dark-mode-only" alt="Typescript" align=left width=24 height=24>

Type definitions are bundled with the package.

### PHP Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/php.svg#gh-light-mode-only" alt="Php" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/php-white.svg#gh-dark-mode-only" alt="Php" align=left width=24 height=24>

The icons are also available through our Packagist package. To install, simply run:

\`\`\`shell
composer require simple-icons/simple-icons
\`\`\`

The package can then be used as follows, where \`[ICON SLUG]\` is replaced by a [slug]:

\`\`\`php
<?php
// Import a specific icon by its slug as:
echo file_get_contents('path/to/package/icons/[ICON SLUG].svg');

// For example:
echo file_get_contents('path/to/package/icons/simpleicons.svg');

// <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>
?>
\`\`\`

## Third-Party Extensions

| Extension | Author |
| :-- | :-- |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/blender.svg#gh-light-mode-only" alt="Blender" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/blender-white.svg#gh-dark-mode-only" alt="Blender" align=left width=24 height=24> [Blender add-on](https://github.com/mondeja/simple-icons-blender) | [@mondeja](https://github.com/mondeja) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/diagramsdotnet.svg#gh-light-mode-only" alt="Drawio" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/diagramsdotnet-white.svg#gh-dark-mode-only" alt="Drawio" align=left width=24 height=24> [Drawio library](https://github.com/mondeja/simple-icons-drawio) | [@mondeja](https://github.com/mondeja) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/drupal.svg#gh-light-mode-only" alt="Drupal" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/drupal-white.svg#gh-dark-mode-only" alt="Drupal" align=left width=24 height=24> [Drupal module](https://www.drupal.org/project/simple_icons) | [Phil Wolstenholme](https://www.drupal.org/u/phil-wolstenholme) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/flutter.svg#gh-light-mode-only" alt="Flutter" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/flutter-white.svg#gh-dark-mode-only" alt="Flutter" align=left width=24 height=24> [Flutter package](https://pub.dev/packages/simple_icons) | [@jlnrrg](https://jlnrrg.github.io/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hexo.svg#gh-light-mode-only" alt="Hexo" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/hexo-white.svg#gh-dark-mode-only" alt="Hexo" align=left width=24 height=24> [Hexo plugin](https://github.com/nidbCN/hexo-simpleIcons) | [@nidbCN](https://github.com/nidbCN/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/homeassistant.svg#gh-light-mode-only" alt="Home Assistant" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/homeassistant-white.svg#gh-dark-mode-only" alt="Home Assistant" align=left width=24 height=24> [Home Assistant plugin](https://github.com/vigonotion/hass-simpleicons) | [@vigonotion](https://github.com/vigonotion/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/jetpackcompose.svg#gh-light-mode-only" alt="Jetpack Compose" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/jetpackcompose-white.svg#gh-dark-mode-only" alt="Jetpack Compose" align=left width=24 height=24> [Jetpack Compose library](https://github.com/DevSrSouza/compose-icons) | [@devsrsouza](https://github.com/devsrsouza/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/kirby.svg#gh-light-mode-only" alt="Kirby" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/kirby-white.svg#gh-dark-mode-only" alt="Kirby" align=left width=24 height=24> [Kirby plugin](https://github.com/runxel/kirby3-simpleicons) | [@runxel](https://github.com/runxel) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/laravel.svg#gh-light-mode-only" alt="Laravel" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/laravel-white.svg#gh-dark-mode-only" alt="Laravel" align=left width=24 height=24> [Laravel Package](https://github.com/ublabs/blade-simple-icons) | [@adrian-ub](https://github.com/adrian-ub) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/python.svg#gh-light-mode-only" alt="Python" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/python-white.svg#gh-dark-mode-only" alt="Python" align=left width=24 height=24> [Python package](https://github.com/sachinraja/simple-icons-py) | [@sachinraja](https://github.com/sachinraja) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg#gh-light-mode-only" alt="React" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/react-white.svg#gh-dark-mode-only" alt="React" align=left width=24 height=24> [React package](https://github.com/icons-pack/react-simple-icons) | [@wootsbot](https://github.com/wootsbot) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/svelte.svg#gh-light-mode-only" alt="Svelte" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/svelte-white.svg#gh-dark-mode-only" alt="Svelte" align=left width=24 height=24> [Svelte package](https://github.com/icons-pack/svelte-simple-icons) | [@wootsbot](https://github.com/wootsbot) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vuedotjs.svg#gh-light-mode-only" alt="Vue" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/vuedotjs-white.svg#gh-dark-mode-only" alt="Vue" align=left width=24 height=24> [Vue package](https://github.com/mainvest/vue-simple-icons) | [@noahlitvin](https://github.com/noahlitvin) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/wordpress.svg#gh-light-mode-only" alt="Wordpress" align=left width=24 height=24><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/wordpress-white.svg#gh-dark-mode-only" alt="Wordpress" align=left width=24 height=24> [WordPress plugin](https://wordpress.org/plugins/simple-icons/) | [@tjtaylo](https://github.com/tjtaylo) |

[slug]: ./slugs.md

## Contribute

Information describing how to contribute can be found here:

https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md
`;

  const result = stripGhThemeLinks(siReadme, "light");
  assert.equal(result.split("\n").length, siReadme.split("\n").length);
});

test.run();
