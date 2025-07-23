import jwt from 'jsonwebtoken';
import { Handler } from "express";
import { User, UserRole } from "../models/User";
import { HttpError } from "../errors/HttpError";
import z from "zod/v4";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";


export interface MyJwtPayload {
    userId: string; username: string; userRole: UserRole;
}

const registerUserSchema = z.object({
    id: z.uuidv4(),
    name: z.string('The name property must be of type string!').min(5, { error: 'The name must be at least 5 characters long!' }),

    email: z.email('Invalid email format!').refine(email => {
        const emailAlreadyInUse = User.getAll().find(user => user.email === email);
        if (emailAlreadyInUse) return false;
        return true;
    }, { error: 'The email is already in use!' }),

    password: z.string('The password property must be of type string!').min(6, { error: 'The password property must be at least 6 characters long!' }),
    role: z.literal(['client', 'admin', 'manager'], {error: 'The role property must be of type client, admin or manager!'})
})

const crendentialsSchema = z.object({
    email: z.email('Invalid email format!'),
    password: z.string('Invalid password!').min(1, { error: 'Invalid password!' })
})

export class AuthController {
    // POST /auth/register
    register: Handler = (req, res) => {
        const newUserAtt = registerUserSchema.parse({
            ...req.body,
            id: uuid(),
            role: 'client'
        })

        newUserAtt.password = bcrypt.hashSync(req.body.password, 10); // protect the password
        
        const newUser = User.registerUser(newUserAtt);
        res.status(201).json(newUser);
    }
    // POST /auth/login
    login: Handler = (req, res) => {
        const providedCredentials = crendentialsSchema.parse(req.body);

        const user = User.getUserByEmail(providedCredentials.email);
        
        if (!user || !bcrypt.compareSync(providedCredentials.password, user.password)) {
            throw new HttpError(401, 'Incorrect credentials!');
        } 

        const payload = { userId: user.id, username: user.name, userRole: user.role } as MyJwtPayload;
        
        if (process.env.JWT_KEY) {
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' });
            res.json(token);
        }
    }
};