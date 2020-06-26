const fs = require('fs')
const HttpStatus = require('http-status-codes');

const basePath = `${__dirname}/../transcriptions/transcription-`

exports.handle = function (request, response) {
    const file = basePath + request.params.id + '.txt';

    if (!fs.existsSync(file)) {
        //file exists
        response.statusCode = HttpStatus.NOT_FOUND;
        response.send({
            "exception" : "transcription not found"
        });
        response.end();
    }

    response.download(file);
}