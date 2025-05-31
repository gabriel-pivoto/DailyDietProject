import z from "zod";
import { knex } from "../database";
import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    });
    const { name, description, isOnDiet, date } = createMealsBodySchema.parse(
      req.body
    );

    await knex("meals").insert({
      id: crypto.randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
      user_id: req.user?.id,
    });
    return res.status(201).send();
  });
}
