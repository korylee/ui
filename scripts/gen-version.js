const version = require('../package.json').version
const { writeFileSync } = require('node:fs')
const { resolve } = require('node:path')

writeFileSync(
  resolve(__dirname, '..', 'src', 'version.ts'),
  `export default '${version}'\n`
)
