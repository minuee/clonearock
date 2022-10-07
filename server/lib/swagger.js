const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: '4D-Replay Test API',
            version: '1.0.0',
            description: '4D-Replay API with express',
        },
        host: 'localhost:3009',
        basePath: '/'
    },
    apis: ['route/*.js']
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};