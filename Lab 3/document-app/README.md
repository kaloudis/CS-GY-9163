# Evan - Dec, 19th, 2018

# Document App
Upload your png or jpeg files

## Installation
```
npm install
npm start

cd client
npm install
npm start
```

## Run tests
```
cd client
npm run tests
```

## Security
### Front-end
- On the front-end React prevents code from the images from being run since we don't use `dangerouslySetInnterHTML`. (XSS protection)

### Back-end
- Cross-Origin Resource Sharing disabled to limit CSRF
- submitted files must be in .jpeg, .jpg, .png
- existing files cannot be overwritten
- new files cannot use special characters to traverse the file system (alphanumeric whitelist)
- Max one file upload of 10MB
- Max two upload fields (second one is for optional name)

### TODOs
- Generate a deletion token to be required for deleting files so this can become a public facing site
- More complex scanning of uploaded files (sandbox in high level hypervisor)

## Other Improvements to be made
- Reflect search term in URL, and load search term on page load
- Flesh out tests (esp. on back-end)
- Add TypeScript
- Consider TypeScript Node engine Deno [https://github.com/denoland/deno]
- Move CSS to LESS
- Swap out react-flexbox-grid for custom LESS classes
- Fix image viewer dimensions in V8

## Libraries
- create-react-app - React scaffolding
- webpack + various loaders - bundle management
- axios - making HTTP calls
- prop-types - type checking pre-TypeScript
- eslint - syntax checking
- react-flexbox-grid - flex css in ReactDOM
- material-ui - loading animation
- jest + enzyme - testing
- babel - JS translation
- express - file server
- multer - handling file uploaders
- lodash - utility functions on the back-end

## API
### GET /documents
Returns a list of all the documents uploaded to the app
#### Params:
- No params
#### Returns:
- files Array
- totalSize float

### GET /search/:searchterm
Returns a list of all the documents uploaded to the app whose filename matches your search term
#### URL Params:
- searchterm string
#### Returns:
- files Array
- totalSize float

### POST /upload/
Uploads a valid image to the application
#### Body Params:
- image file
- filename (optional) string
#### Returns:
- message string
- success boolean

## Other Notes
### Potential Ways to handle permissioned file deletions
- SQL db that keeps track of deletion key - image pairings
- Without DB: Create a text file with a randomly generated name, name represents deletion key, file body represents image path
