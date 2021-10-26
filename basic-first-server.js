const express = require('express');
const express_graphql = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

// Create GraphQL Schema
const schema = buildSchema(`
    type Query {
        message: String
    }
`);


// Impl a Root Resolver
const rootResolver = {
    message: () => 'Hello and Welcome in GraphQL World!'
}

// Create an express/GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true,
}));

app.listen(4000, () => console.log(`Express Server is running on localhost:4000`));