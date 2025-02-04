import express from "express";
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql"


async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 5555

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" });
    });

    const gqlserver = await createApolloGraphqlServer()
    app.use("/graphql", expressMiddleware(gqlserver) as any);

    app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
}

init();