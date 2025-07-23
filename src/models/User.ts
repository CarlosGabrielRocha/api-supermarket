import { HttpError } from "../errors/HttpError";
import bycript from "bcrypt";

export type UserRole = 'client' | 'admin' | 'manager';

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface OptionalUserAttributes {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}

export class User {
    protected static users: User[] = [
        new User({
            id: '1',
            name: 'Dayse',
            email: 'dayse@gmail.com',
            password: bycript.hashSync('123456', 10),
            role: 'manager'
        })
    ]

    protected _id: string;
    protected _name: string;
    protected _email: string;
    protected _password: string;
    protected _role: UserRole | undefined = 'client';

    get name() {
        return this._name;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get id() {
        return this._id;
    }

    get role() {
        return this._role;
    }

    constructor(attributes: UserAttributes) {
        this._id = attributes.id;
        this._name = attributes.name;
        this._email = attributes.email;
        this._password = attributes.password;
        this._role = attributes.role;
    }

    public static getAll() {
        const users = User.users.map((user => {
            return {
                id: user._id,
                name: user._name,
                email: user._email,
                role: user._role
            }
        }));
        return users;
    }

    public static getById(id: string) {
        const user = this.getFullById(id);
        return {
            id: user._id,
            name: user._name,
            email: user._email,
            role: user._role
        }
    }

    public static getFullById(id: string): User {
       const user = User.users.find(user => user.id === id);
       if (!user) throw new HttpError(404, 'User not found!'); 
       return user;
    }

    public static getUserByEmail = (email: string) => User.users.find(user => {
        return user.email.toLowerCase() === email.toLowerCase()
    });

    public static registerUser(attributes: UserAttributes) {
        const userInstance = new User(attributes);
        User.users.push(userInstance);

        return { ...attributes, password: undefined };
    }

    public static editUser(id: string, attributes: OptionalUserAttributes) {
        const userIndex = User.users.findIndex(user => user.id === id);
        if (userIndex === -1) throw new HttpError(404, 'User not found!');
        if (attributes.name) User.users[userIndex]._name = attributes.name;
        if (attributes.email) User.users[userIndex]._email = attributes.email;
        if (attributes.password) User.users[userIndex]._password = attributes.password;
        if (attributes.role) User.users[userIndex]._role = attributes.role;
        return this.getById(id);
    }

    public static removeUser(id: string) {
        const userToRemove = this.getById(id);
        this.users = this.users.filter(user => user.id !== userToRemove.id);
        return userToRemove;
    }

}

