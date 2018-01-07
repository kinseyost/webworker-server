/* eslint-disable no-console*/

import express from 'express';
import colors from 'colors';
import proxy from 'http-proxy-middleware';

const app = express();
const port = 8081;
const isRunningInDocker = process.env.DOCKER_ENV;
const url = isRunningInDocker ? 'http://storage:8082' : 'https://localhost:8082';
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use('/uploads.json', proxy({ target: url, changeOrigin: true }));

app.listen(port, () => console.log('connected to port', port));