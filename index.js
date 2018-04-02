const express = require('express')
const path = require('path')
const multer =  require('multer')

const buildOne = require('./handlers/buildOne')

const INPUT_PATH = path.resolve('files/input')
const upload = multer({ dest: `${INPUT_PATH}/` })
const app = express();

app.listen(3000, function () {
    console.log('listening on port 3000!');
});


app.post('/context/create',
  upload.fields([
    { name: 'attachments' } ]),
  (req, res) => {
    //TODO Middleware that allows to create a context for a latex file
    // this means, images and other attachments that will go into multiple pdf files
    // can be uploaded beforehand, so the only missing piece is the template
    // this middleware should create a folder with all the required information inside
    // of it and create a subfolder `builds` where individual builds will be built
})

app.post('/context/build/:context',
  upload.fields(),
  (req, res) => {
    // TODO this middleware will check if the context exists, then create a subdirectory
    // inside the context builds directory where it will run the build with the latex file
    // provided in this request
})

app.post('/build',
  upload.fields([
    { name: 'template', maxCount: 1 },
    { name: 'inputs', maxCount: 50 },
    { name: 'fonts', maxCount: 20 },
   ]),
  buildOne )
