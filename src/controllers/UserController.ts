import { Handler } from "express";
import { User } from "../models/User";
import z from "zod/v4";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Admin } from "../models/Admin";
import { Manager } from "../models/Manager";

const editUserSchema = z.object({
    name: z.string('The name property must be of type string!').min(5, { error: 'The name must be at least 5 characters long!' }).optional(),

    email: z.email('Invalid email format!').refine(email => {
        const emailAlreadyInUse = User.getAll().find(user => {
            return user.email.toLowerCase() === email.toLowerCase()
        });
        if (emailAlreadyInUse) return false;
        return true;
    }, { error: 'The email is already in use!' }).optional(),

    password: z.string('The password property must be of type string!').min(6, { error: 'The password property must be at least 6 characters long!' }).optional(),
    role: z.literal(['client', 'admin', 'manager'], { error: 'The role property must be of type client, admin or manager!' }).optional()
})

const createUserSchema = z.object({
    id: z.uuidv4(),
    name: z.string('The name property must be of type string!').min(5, { error: 'The name must be at least 5 characters long!' }),

    email: z.email('Invalid email format!').refine(email => {
        const emailAlreadyInUse = User.getAll().find(user => {
            return user.email.toLowerCase() === email.toLowerCase()
        });
        if (emailAlreadyInUse) return false;
        return true;
    }, { error: 'The email is already in use!' }),

    password: z.string('The password property must be of type string!').min(6, { error: 'The password property must be at least 6 characters long!' }),
    role: z.literal(['client', 'admin', 'manager'], { error: 'The role property must be of type client, admin or manager!' })
})

export class UserController {
    // GET /api/users
    index: Handler = (req, res) => { res.json(User.getAll()) }

    // GET /api/users/admins
    admins: Handler = (req, res) => { res.json(Admin.getAll()) }

    // GET /api/users/managers
    managers: Handler = (req, res) => { res.json(Manager.getAll()) }

    // GET /api/users/:id
    find: Handler = (req, res) => {
        const { id } = req.params;
        const user = User.getById(id);
        res.json(user);
    }

    // POST /api/users
    create: Handler = (req, res) => {
        const newUser = createUserSchema.parse({
            ...req.body,
            id: uuid(),
        })
        newUser.password = bcrypt.hashSync(req.body.password, 10); // Protege Senha

        if (newUser.role === 'admin') {
            Admin.registerUser(newUser);
        } else if (newUser.role === 'manager') {
            Manager.registerUser(newUser)
        } else {
            User.registerUser(newUser)
        }

        res.status(201).json({ ...newUser, password: undefined });
    }

    // PUT /api/users/:id
    edit: Handler = (req, res) => {
        const { id } = req.params;
        const infoToEdit = editUserSchema.parse(req.body);

        if (infoToEdit.password) infoToEdit.password = bcrypt.hashSync(infoToEdit.password, 10);

        const userToEdit = User.getFullById(id);
        if (infoToEdit.role && infoToEdit.role !== userToEdit.role) {
            // If the role property is present in the JSON sent from the request
            // and if it's different from the current role, then the following code will be
            // executed:

            // remove the currently instance from the storage
            User.removeUser(id);
            if (userToEdit instanceof Admin) Admin.removeUser(id);
            if (userToEdit instanceof Manager) Manager.removeUser(id);

            const valuesForNewInstance = {
                id: userToEdit.id,
                name: userToEdit.name,
                email: userToEdit.email,
                password: userToEdit.password,
                role: userToEdit.role
            }

            // create a new instance with the same old values
            if (infoToEdit.role === 'admin') Admin.registerUser(valuesForNewInstance);
            else if (infoToEdit.role === 'manager') Manager.registerUser(valuesForNewInstance);
            else User.registerUser(valuesForNewInstance);
        }
        
        User.editUser(id, infoToEdit);

        res.json(User.getById(id));
    }

    // DELETE /api/users/:id
    remove: Handler = (req, res) => {
        const { id } = req.params;
        const userToRemove = User.getById(id);
        if (userToRemove.role === 'admin') Admin.removeUser(id);
        if (userToRemove.role === 'manager') Manager.removeUser(id);
        if (userToRemove.role === 'client') User.removeUser(id);
        res.json(userToRemove);
    }
}

