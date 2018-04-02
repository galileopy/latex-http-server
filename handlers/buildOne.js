const uuid = require('short-uuid').uuid
const path = require('path')
const build = require('./build/buildOne')
const fs = require('mz/fs')
const rmfr = require('rmfr');

const COMPILE_PATH = path.resolve('files/compiling')
const OUTPUT_PATH = path.resolve('files/output')

const deleteFile = (output) =>
  ( err ) => {
    rmfr( output.destination )
    .then( () => { if (err) throw err } )
  }

const moveResources = ( files, { destination } ) => {

  const moving = files.map( ( file ) => {
      const filename = path.resolve( destination, file.originalname )
      return fs.rename( file.path, filename )
  })

  return Promise.all(moving)
}

const makeDirectories = ( file ) => {
  const id = uuid()

  const input = {
    destination: file.destination,
    filename: file.filename,
    path: file.path
  }

  const compiling = {
    destination: path.resolve(COMPILE_PATH, id),
    filename: file.filename,
    path: path.resolve(COMPILE_PATH, id, file.filename)
  }


  const base = path.format({
    ext : '.pdf',
    name: path.parse(file.originalname).name
  })

  const output = {
    destination: path.resolve(OUTPUT_PATH, id),
    filename: base,
    path: path.resolve(OUTPUT_PATH, id, base)
  }

  return { compiling, output, input }
}

module.exports = (req, res) => {
    console.log( req.files )
    const file = req.files.template[0]
    const { compiling, output, input } = makeDirectories(file)

    const options = {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename= ' + output.filename
      }
    }

    fs.mkdir( compiling.destination  )
    .then( () => {
      if ( req.files.inputs )
        return moveResources( req.files.inputs, compiling )
    })
    .then( () => {
      if ( req.files.fonts )
        return moveResources( req.files.fonts, compiling )
    })
    .then( () => fs.mkdir( output.destination  ))
    .then( () => fs.rename( input.path, compiling.path ) )
    .then( () => build( compiling.path, output.path ) )
    .then( () => rmfr( compiling.destination ))
    .then( () => res.sendFile(output.path, options, deleteFile(output) ))
    .catch( ( error ) => {
      res.status(500)
      res.json( { error: error.message } )
    })


}
