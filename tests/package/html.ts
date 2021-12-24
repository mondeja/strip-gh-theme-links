import { test } from "uvu";
import * as assert from 'uvu/assert'
import { stripGhThemeLinks } from '../..';

test("Strip HTML absolute inline with alt", () => {
  const content = `
Before <img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar" alt="Node.js">After
Before <img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz" alt="Node.js">After`

  // keep light
  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
Before <img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar" alt="Node.js">After
Before After`
  )
  // keep dark
  assert.equal(
    stripGhThemeLinks(content, 'dark'),
    `
Before After
Before <img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg?ver=1.0.5&bar=baz" alt="Node.js">After`
  )
})

test("Strip HTML absolute inline", () => {
  const content = `
<img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar">
<img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz">`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
<img src="https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar">
`
  )
})


test("Strip HTML relative inline", () => {
  let content = `
<img src="./assets/readme/nodedotjs-black.svg#gh-light-mode-only"><img src="./assets/readme/nodedotjs-white.svg#gh-dark-mode-only">`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
<img src="./assets/readme/nodedotjs-black.svg">`
  )

  content = `
<img src="../../nodedotjs-black.svg#gh-light-mode-only"><img src="./assets/readme/nodedotjs-white.svg#gh-dark-mode-only">`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
<img src="../../nodedotjs-black.svg">`
  )
})

test.run()
