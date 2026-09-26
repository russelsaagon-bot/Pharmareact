import swaggerJsdoc from "swagger-jsdoc";

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "API Gestion Pharmacie",

            version: "1.0.0",

            description:
                "Documentation officielle de l'API de gestion de pharmacie"

        },

        servers: [

            {

                url: "http://localhost:5000"

            }

        ],

        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        },

        security: [

            {

                bearerAuth: []

            }

        ]

    },

    apis: [

        "./src/routes/*.js"

    ]

};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;