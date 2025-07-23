import { Handler } from "express";
import { Purchase } from "../models/Purchase";

export class PurchaseController {
    // GET /api/purchases
    index: Handler = (req, res) => { res.json(Purchase.getAll()) }

    // GET /api/purchases/:id
    find: Handler = (req, res) => {
        const { id } = req.params;
        const purchase = Purchase.getById(id);
        res.json(purchase);
    }
}