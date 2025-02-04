import express from "express";
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql"
import UserService from "./services/user";


async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 5556

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" });
    });


    app.use("/graphql", expressMiddleware(await createApolloGraphqlServer(), { context: async ({req}) => {
        // const token = req.headers['token'];
        const token = (Array.isArray(req.headers['token']) ? req.headers['token'][0] : req.headers['token']) || '';
        try{
            const user = UserService.decodeJWTToken(token);
            return { user };
        }catch (error) {
            return {};
        }
    }})as any);

    app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
}

init();