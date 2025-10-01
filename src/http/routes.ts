import { app } from "../app";
import { userRoutes } from "./controllers/users/user-routes";

app.register(userRoutes);