import express from "express";
import { UserController } from "../controllers/UserController";
import { ensureAuthentication, ensureIsAdmin, managerOnly } from "../middlewares/authMiddlewares";

export const usersRouter = express.Router();

const userController = new UserController();

usersRouter.use(ensureAuthentication);

usersRouter.get('/', managerOnly, userController.index);

usersRouter.get('/admins', managerOnly, userController.admins);
usersRouter.get('/managers', managerOnly, userController.managers);

usersRouter.get('/:id', ensureIsAdmin, userController.find);


usersRouter.post('/', managerOnly, userController.create);
usersRouter.put('/:id', managerOnly, userController.edit);

usersRouter.delete('/:id', managerOnly, userController.remove);
