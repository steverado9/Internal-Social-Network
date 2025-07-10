import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
        version: 'v1.0.0',
        title: 'Teamwork Api',
        description: 'Api docs for Andela Team'
        },
        servers: [
            {
                url: process.env.SWAGGER_URL
            },
        ],
        components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    }    
    },
    apis: ["./src/route/**/*.ts"] // path to your route files
};




export const swaggerSpec = swaggerJSDoc(options);