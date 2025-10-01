import { FastifyInstance } from "fastify";
import { app } from "../app";
import { userRoutes } from "./controllers/users/user-routes";

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes)
}