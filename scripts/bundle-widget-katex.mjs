// Self-host the installed renderer; inline font data works in the sandboxed game iframe.
import fs from 'node:fs'
import path from 'node:path'
const source='node_modules/katex/dist',target='public/vendor/katex'
fs.mkdirSync(target,{recursive:true})
let css=fs.readFileSync(path.join(source,'katex.min.css'),'utf8')
css=css.replace(/src:[^;]+;/g,declaration=>{const match=declaration.match(/url\((fonts\/[^)]+\.woff2)\)\s*format\("woff2"\)/);if(!match)throw Error('Missing WOFF2 font');return `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(source,match[1])).toString('base64')}) format("woff2");`})
fs.writeFileSync(path.join(target,'katex.min.css'),css)
fs.copyFileSync(path.join(source,'katex.min.js'),path.join(target,'katex.min.js'))
fs.copyFileSync('node_modules/katex/LICENSE',path.join(target,'LICENSE'))
console.log('Bundled local KaTeX with embedded fonts; no CDN requests.')
