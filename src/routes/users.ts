import z from "zod";
import { app } from "../app";
import knex from "knex";

app.post("/", async (req, res) => {
  const createUserBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
  });
  const { name, email } = createUserBodySchema.parse(req.body);
  await knex("users").insert({
    id: crypto.randomUUID(),
    session_id: crypto.randomUUID(),
    name,
    email,
  });
  return res.status(201).send();
});
