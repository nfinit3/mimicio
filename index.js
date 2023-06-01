#!/usr/bin/env node

import express from 'express';
import fs from 'fs';
import path from 'path';
import getPort, { portNumbers } from 'get-port';

const app = express();

function getDirectoryStructure(startPath) {
    const result = { Service: path.basename(startPath), Methods: {} };
    const files = fs.readdirSync(startPath);
    for (let file of files) {
        const filePath = path.join(startPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const method = file;
            const endpoints = fs.readdirSync(filePath);
            result.Methods[method] = endpoints.map((endpoint) => {
                const statusFiles = fs.readdirSync(
                    path.join(filePath, endpoint)
                );
                const statuses = statusFiles.map((file) => file.split('.')[0]);
                return { endpoint: endpoint, status: statuses };
            });
        }
    }
    return result;
}

app.get('/', (req, res) => {
    const structure = getDirectoryStructure(path.join(process.cwd()));
    res.send(`<pre>${JSON.stringify(structure, null, 2)}</pre>`);
});

app.use((req, res, next) => {
    const serviceName = req.path.split('/')[1];
    const method = req.method;
    const endpoint = req.path.split('/')[2];
    const status = req.path.split('/')[3] ? req.path.split('/')[3] : '200';
    try {
        const filePath = path.join(
            process.cwd(),
            serviceName,
            method,
            endpoint,
            status + '.json'
        );
        const data = fs.readFileSync(filePath);
        res.status(status).send(JSON.parse(data));
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

getPort({ port: portNumbers(3000, 3999) }).then((port) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
