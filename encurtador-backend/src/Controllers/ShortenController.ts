import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shortenService } from "../Services/ShortenService";

export async function shortenController(app: FastifyInstance) {
    app.post("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as { url: string }
            const identifier = await shortenService.register(body.url)
            return identifier
            
        } catch (error: any) {
            return reply.status(404).send({ error: "not Found" })
        }
    })


    app.get("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        try {

            const query = request.query as { identifier: string }
            const url = await shortenService.findByIdentifier(query.identifier)
            return url

        } catch (error: any) {
            return reply.status(404).send({ error: "not Found" })
        }
    })
}