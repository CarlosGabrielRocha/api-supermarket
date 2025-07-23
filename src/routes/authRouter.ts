/* AUTHENTICATION ROUTER */
// /auth/register
// /auth/login

import express from "express";
import { AuthController } from "../controllers/AuthController";

export const authRouter = express();

const authController = new AuthController();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);