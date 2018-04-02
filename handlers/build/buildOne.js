const fs = require('mz/fs')
const latex = require('node-latex')
const promisifiedPipe = require('./promisifiedPipe')

const buildOne = ( src, dest ) => {
  // this builds a single latex file
  const input = fs.createReadStream( src )
  const content = latex(input)
  const output = fs.createWriteStream( dest )

  return promisifiedPipe(content, output)
  // remove the input file and directory since it is no longer needed

}

module.exports = buildOne
