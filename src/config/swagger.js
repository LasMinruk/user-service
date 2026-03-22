const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'REST API documentation for the User Service microservice. Manages user accounts for the ecommerce platform.'
    },
    servers: [
      {
        url: 'http://54.80.178.204:3001',
        description: 'AWS Production Server'
      },
      {
        url: 'http://localhost:3001',
        description: 'Local Development Server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7a8b9c0d1',
              description: 'MongoDB ObjectId'
            },
            name: { type: 'string', example: 'Alice Fernando' },
            email: { type: 'string', example: 'alice@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'Kasun Silva' },
            email: { type: 'string', example: 'kasun@example.com' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customSiteTitle: 'User Service API Docs',
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
    swaggerOptions: { persistAuthorization: true }
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger docs available at /api-docs');
};

module.exports = setupSwagger;
