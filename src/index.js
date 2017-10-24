/* eslint-disable no-console*/

import express from 'express';
import http from 'http';
import colors from 'colors';
import proxy from 'express-http-proxy';
import fetch from 'node-fetch';

var upload = multer();

const isRunningInDocker = process.env.DOCKER_ENV;

const app = express();
const server = http.Server(app);
const port = 8081;
const url = isRunningInDocker ? 'http://storage:8082' : 'https://localhost:8082';
console.log(url);
let shouldConnect = 0;

app.post('/uploads', upload.array('files'), async (req, res) => {
  console.log('files received in proxy', req.files);
  const files = req.files;
  console.log('\n\n\n', 'HEADERS', req.headers, '\n\n\n');
  const {
    'conetent-legnth': contentLength,
    'content-type': contentType,
    'accept-encoding': encoding,
    cookie,
    connection,
    accept,
  } = req.headers;
  try {
    const remoteResponse = await fetch(`${url}/storefiles`, {
      headers: {
        contentLength,
        contentType,
        cookie,
        connection,
        accept,
      },
      mode: 'no-cors',
      credentials: 'include',
      method: 'POST',
      body: files,
    });
    // console.log(remoteResponse);
    
} catch (e) {
  console.error(e);
}
  res.status(200).send('Got the goods');
});

server.listen(port, () => {
  console.log(`listening on :${port}`);
});


'use strict'
const http = require('http')
const url = require('url')
const debug = require('debug')('stream-proxy')

http.createServer(function (clientReq, serverRes) {
  debug('url', clientReq.url)
  const options = url.parse(clientReq.url)
  options.headers = clientReq.headers
  options.method = clientReq.method
  clientReq.pause()
  const serverReq = http.request(options, function (remoteRes) {
    remoteRes.pause()
    serverRes.writeHeader(remoteRes.statusCode, remoteRes.headers)
    remoteRes.pipe(serverRes)
    remoteRes.resume()
  })
  clientReq.pipe(serverReq)
  clientReq.resume()
}).listen(8091, function () {
  console.log('Listen on 8091')
})