import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';


async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 5555

    app.use(express.json());

    // creating a graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `,//schema
        resolvers: {
            Query: {
                hello: () => `Hey there, i am graphql server!`,
                say: (_, {name}: {name: string} ) => `Hey ${name}, how are you?`
            },
        },
    });

    //start the gql server
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" });
    });


    app.use("/graphql", expressMiddleware(gqlServer) as any);

    app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
}

init();