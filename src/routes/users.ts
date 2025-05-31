import z from "zod";
import { knex } from "../database";
import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email("Invalid email format"),
    });
    const { name, email } = createUserBodySchema.parse(req.body);
    let session_id = req.cookies.session_id;

    if (!session_id) {
      session_id = crypto.randomUUID();
      res.setCookie("session_id", session_id, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }
    const userByEmail = await knex("users").where({ email }).first();

    if (userByEmail) {
      return res.status(400).send({
        message: "User already exists with this email",
      })
    }
    await knex("users").insert({
      id: crypto.randomUUID(),
      session_id: session_id,
      name,
      email,
    });
    return res.status(201).send();
  });
  app.get("/", async (req, res) => {
    const session_id = req.cookies.session_id;

    if (!session_id) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const user = await knex("users").where({ session_id }).first();

    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    return res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  });
}
