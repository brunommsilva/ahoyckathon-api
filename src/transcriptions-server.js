// IMPORTS
const express = require('express');
// APIS
const transcriptionsApi = require('./apis/transcriptions-api');

module.exports = {
    start: function (port) {

        console.log('Starting api...');

        var api = express();

        // Route registration and server start
        api.get('/transcriptions/:id', function (req, res) {
            transcriptionsApi.handle(req, res);
        });
        api.listen(port);

        console.log('Api has started on port ' + port + '...');
    }
}