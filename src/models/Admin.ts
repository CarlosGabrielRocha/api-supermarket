import { HttpError } from "../errors/HttpError";
import { User, UserAttributes } from "./User";

export class Admin extends User {
    private static admins: Admin[] = []

    constructor(attributes: UserAttributes) {
        super({...attributes, role: 'admin'})
    }

    public static registerUser(attributes: UserAttributes) {
        const userInstance = new Admin(attributes);
        User.users.push(userInstance);
        Admin.admins.push(userInstance);

        return { ...attributes, password: undefined };
    }

    public static getAll() {
        const admins = this.admins.map((admin => {
            return {
                id: admin._id,
                name: admin._name,
                email: admin._email,
                role: admin._role
            }
        }));

        return admins;
    }

    public static getById(id: string) {
        const admin = this.admins.find(admin => admin.id === id);
        if (!admin) throw new HttpError(404, 'User not found!');
        return {
            id: admin._id,
            name: admin._name,
            email: admin._email,
            role: admin._role
        }
    }

    public static getFullById(id: string): Admin {
        const admin = Admin.admins.find(admin => admin.id === id);
        if (!admin) throw new HttpError(404, 'User not found!');
        return admin
    }

    public static removeUser(id: string) {
        const userToRemove = this.getById(id);
        this.admins = this.admins.filter(user => user.id !== userToRemove.id);
        User.users = User.users.filter(user => user.id !== userToRemove.id);
        return userToRemove;
    }
}