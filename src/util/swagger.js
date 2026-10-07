const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');
const { Component } = require('react');

const routesGlob = path.join(__dirname, '../routes/*.js').replace(/\\/g, '/');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [routesGlob]
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

module.exports = { swaggerDocs };