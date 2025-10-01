import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blusalt Drone API',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger. It is a drone service for a medication delivery system.',
      contact: {
        name: 'Ayomide Akinrotoye',
        url: 'https://www.ayomideakinrotoye.com',
        email: 'akinrotoyeayomide@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    externalDocs: {
      description: 'Find out more about the project',
      url: 'https://github.com/ayomide-akinrotoye/blusalt-drone-api',
    },
    servers: [
      {
        url: 'http://localhost:5003',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/v1/*.ts', './src/models/**/*.ts', './src/enums/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
