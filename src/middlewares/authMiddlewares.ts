import { Handler } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../errors/HttpError';
import { User } from '../models/User';
import { MyJwtPayload } from '../controllers/AuthController';

export const ensureAuthentication: Handler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new HttpError(401, 'You need to be authenticated to access this route!');

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_KEY as string) as MyJwtPayload;
    const user = User.getAll().find(user => user.id === decodedToken.userId);
    if (!user) throw new HttpError(401, 'The logged-in user was not found in our database!');
    req.authenticatedUser = user;
    next();
}

export const ensureIsAdmin: Handler = (req, res, next) => {
    if (req.authenticatedUser.role === 'admin' || req.authenticatedUser.role === 'manager') {
        next();
    } else {
        throw new HttpError(401, 'You do not have permission to access this route!');
    }
}

export const managerOnly: Handler = (req, res, next) => {
    if (req.authenticatedUser.role === 'manager') {
        next();
    } else {
        throw new HttpError(401, 'You do not have permission to access this route!');
    }
}


