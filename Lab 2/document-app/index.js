const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const reverse = require('lodash/reverse');
const sortBy = require('lodash/sortBy');
const cloneDeep = require('lodash/cloneDeep');
const includes = require('lodash/includes');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const multer = require('multer');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const handleError = (err, res) => {
    const errorMessage = {
        error: true,
        message: 'Oops! An error occured'
    };

    res
        .status(500)
        .contentType('text/plain')
        .end(JSON.stringify(errorMessage));
};

const upload = multer({
    dest: __dirname + '/client/build/uploaded/',
    fileSize: 10000000, // 10MB in bytes
    fields: 2,
    files: 1,
}).single('image');

function readFilesSync(dir, files = []) {
    let totalSize = 0;
    fs.readdirSync(dir)
        .forEach(filename => {
            const name = path.parse(filename).name;
            const ext = path.parse(filename).ext;
            const filepath = path.resolve(dir, filename);
            const stat = fs.statSync(filepath);
            const isFile = stat.isFile();
            totalSize += stat.size;

            if (isFile && name[0] !== '.') files.push({ fileName: name + ext, stat });
        });

    return {files, totalSize};
}

// Multi-process to utilize all CPU cores
if (cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const app = express();

    app.use(bodyParser.json()); // get information from html forms
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static(path.resolve(__dirname + '/client/build')));

    // Answer API requests
    app.get('/documents', function(req, res) {
        const {files, totalSize} = readFilesSync(path.join(__dirname, './client/build/uploaded/'));

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({files, totalSize}));
    });

    app.get('/delete/:filename', function(req, res) {
        const filename = req.params.filename;
        fs.exists(path.join(__dirname, './client/build/uploaded/', filename), function (exists) {
            if (exists) {
                fs.unlink(path.join(__dirname, './client/build/uploaded/', filename), function(err){
                     if (err) {
                         const deletionErrorMessage = {
                             success: false,
                             message: 'Error deleting file.'
                         };

                         return res
                             .status(403)
                             .contentType('text/plain')
                             .end(JSON.stringify(deletionErrorMessage));
                    }

                     const successMessage = {
                         success: true,
                         message: 'File deleted successfully!'
                     };

                     res
                         .status(200)
                         .contentType('text/plain')
                         .end(JSON.stringify(successMessage));
                });
            } else {
                // file not found
                const notFoundMessage = {
                    success: false,
                    message: 'File not found. Cannot delete.'
                };

                return res
                    .status(403)
                    .contentType('text/plain')
                    .end(JSON.stringify(notFoundMessage));
            }
        });
    });

    app.get('/search/:searchterm', function(req, res) {
        const searchterm = req.params.searchterm;
        const {files} = readFilesSync(path.join(__dirname, './client/build/uploaded/'));

        const filteredFiles = [];
        const re = new RegExp(searchterm);

        let totalSize = 0;
        files.forEach(file => {
            if (re.exec(file.fileName)) {
                filteredFiles.push(file);
                totalSize += file.stat.size;
            }
        });

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({files: filteredFiles, totalSize}));
    });

    app.post('/upload', function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                return handleError(err, res);
            }

            let duplicate, invalidCharacters, fileExtension;
            const tempPath = req.file.path;
            const originalName = req.file.originalname;
            const targetName = req.body.filename.split(".")[0] || originalName.split(".")[0];

            /*
            for XSS demonstration purposes - do not include this check here
            // only alphanumeric and underscore characters allowed
            const allowedCharacters = /^[a-zA-Z0-9_]*$/g;

            if (!allowedCharacters.exec(targetName)) {
                invalidCharacters = true;

                fs.unlink(tempPath);

                const invalidCharMessage = {
                    success: false,
                    message: 'File name contains invalid characters. Please upload with a new name.'
                };

                res
                    .status(403)
                    .contentType('text/plain')
                    .end(JSON.stringify(invalidCharMessage));
            }
            */

            if (!invalidCharacters) {
                // check if file already exists
                fileExtension = path.extname(originalName).toLowerCase();
                const {files} = readFilesSync(path.join(__dirname, './client/build/uploaded/'));
                files.forEach(file => {
                    if (includes(file, targetName + fileExtension)) {
                        const duplicateMessage = {
                            success: false,
                            message: 'File already exists. Please upload with a new name.'
                        };

                        fs.unlink(tempPath);

                        duplicate = true;

                        res
                            .status(403)
                            .contentType('text/plain')
                            .end(JSON.stringify(duplicateMessage));
                    }
                });
            }

            if (!duplicate && !invalidCharacters) {
                let namePlusExt;
                if (fileExtension) {
                    namePlusExt = targetName + fileExtension;
                }

                const targetPath = path.join(__dirname, './client/build/uploaded/', namePlusExt || targetName);

                if ((fileExtension === '.png' || fileExtension === '.jpeg' || fileExtension === '.jpg') && originalName[0] !== '.') {
                    fs.rename(tempPath, targetPath, err => {
                        if (err) return handleError(err, res);

                        const successMessage = {
                            success: true,
                            message: 'File uploaded!'
                        };

                        res
                            .status(200)
                            .contentType('text/plain')
                            .end(JSON.stringify(successMessage));
                    });
                } else {
                    fs.unlink(tempPath, err => {
                        if (err) return handleError(err, res);

                        const errorMessage = {
                            success: false,
                            message: 'Only .png, .jpeg, and .jpg files are allowed!'
                        };

                        res
                            .status(403)
                            .contentType('text/plain')
                            .end(JSON.stringify(errorMessage));
                      });
                }
            }
        });
    });

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(request, response) {
        response.sendFile(path.resolve(__dirname + '/client/build', 'index.html'));
    });

    app.listen(PORT, function () {
        console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
    });
}
