import swaggerJSDoc from 'swagger-jsdoc';

const PORT: number = Number(process.env.PORT) || 3000;

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
        email: 'ayomirotoye@gmail.com',
      },
    },
    externalDocs: {
      description: 'Find out more about the project',
      url: 'https://github.com/ayomirotoye/blusalt-drone-api',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'development'
            ? `http://localhost:${PORT}`
            : process.env.BASE_URL,
        description: process.env.NODE_ENV === 'development' ? 'Development server' : 'Api Server',
      },
    ],
  },
  apis: ['./src/routes/v1/*.ts', './src/models/**/*.ts', './src/enums/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
