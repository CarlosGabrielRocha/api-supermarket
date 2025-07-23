import { ErrorRequestHandler } from "express";
import { ZodError } from "zod/v4";
import { HttpError } from "../errors/HttpError";
import { JsonWebTokenError } from "jsonwebtoken";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        res.status(400).json({ errorMessage: err.issues[0].message});
    } else if (err instanceof HttpError) {
        res.status(err.status).json({ errorMessage: err.message });
    } else if (err instanceof JsonWebTokenError) {
        res.status(401).json({ errorMessage: 'Token inválido!'});
    } else {
        res.status(500).json({ errorMessage: err.message });
    }
} 