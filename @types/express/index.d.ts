import { User } from "../models/User";

declare global {
    declare namespace Express {
        export interface Request {
            authenticatedUser: User;
        }
    }
}


