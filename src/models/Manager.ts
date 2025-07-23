import { HttpError } from "../errors/HttpError";
import { User, UserAttributes } from "./User";
import bycript from "bcrypt";

export class Manager extends User {
    private static managers: Manager[] = [
        new Manager({
            id: '2',
            name: 'Dayse',
            email: 'dayse@gmail.com',
            password: bycript.hashSync('123456', 10),
            role: 'manager'
        })
    ]

    constructor(attributes: UserAttributes) {
        super({...attributes, role: 'manager'})
    }

    public static registerUser(attributes: UserAttributes) {
        const userInstance = new Manager(attributes);
        User.users.push(userInstance);
        Manager.managers.push(userInstance);

        return { ...attributes, password: undefined };
    }

    public static getAll() {
        const managers = Manager.managers.map((manager => {
            return {
                id: manager._id,
                name: manager._name,
                email: manager._email,
                role: manager._role
            }
        }));
        return managers;
    }

    public static getById(id: string) {
        const manager = Manager.managers.find(manager => manager.id === id);
        if (!manager) throw new HttpError(404, 'User not found!');
        return {
            id: manager._id,
            name: manager._name,
            email: manager._email,
            role: manager._role
        }
    }

    public static removeUser(id: string) {
        const userToRemove = this.getById(id);
        this.managers = this.managers.filter(user => user.id !== userToRemove.id);
        User.users = User.users.filter(user => user.id !== userToRemove.id);
        return userToRemove;
    }
}

