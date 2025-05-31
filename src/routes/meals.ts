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
  app.put("/:id", { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const updateMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    });
    const { name, description, isOnDiet, date } = updateMealsBodySchema.parse(
      req.body
    );
    const { id } = req.params as { id: string };
    const meal = await knex("meals")
      .where({ id, user_id: req.user?.id })
      .first();
    if (!meal) {
      return res.status(404).send({ error: "Meal not found" });
    }
    await knex("meals").where({ id, user_id: req.user?.id }).update({
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
    });

    res.send();
  });
  app.get("/", { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const meals = await knex("meals")
      .where({ user_id: req.user?.id })
      .select("*");

    return res.status(200).send(meals);
  });
  app.get("/:id", {preHandler: [checkSessionIdExists]}, async (req, res) => {
    const { id } = req.params as { id: string };
    const meal = await knex("meals")
      .where({ id, user_id: req.user?.id })
      .first();

    if (!meal) {
      return res.status(404).send({ error: "Meal not found" });
    }

    return res.status(200).send(meal);
  })
}
