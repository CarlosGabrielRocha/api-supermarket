import z from "zod/v4";
import { v4 as uuid} from "uuid";
import { Handler } from "express";
import { CashRegister } from "../models/CashRegister";

const registerCashRegisterZ = z.object({
    id: z.uuidv4(),
    adminId: z.string('The adminId property must be of type string!').refine( adminId => {
        const isAdminCashier = CashRegister.getAll().find(cr => cr.cashier.id === adminId)
        if (!isAdminCashier) return true;
        else return false;
    }, { error: 'The user is already a cashier!' }),
    availableFunds: z.number('The availableFunds property must be of type number!').nonnegative('The availableFunds cant be less than 0').optional()
})

const editCashRegisterZ = z.object({
    adminId: z.string('The adminId property must be of type string!').refine( adminId => {
        const isAdminCashier = CashRegister.getAll().find(cr => cr.cashier.id === adminId)
        if (!isAdminCashier) return true;
        else return false;
    }, { error: 'The user is already a cashier!' }).optional(),
    availableFunds: z.number('The availableFunds property must be of type number!').nonnegative('The availableFunds cant be less than 0').optional()
})

const newPurchaseSchema = z.object({
    id: z.string('The id property must be of type string!'),
    productIds: z.array(z.string(), {error: 'The productIds property must be an array of strings!'}),
    cashRegisterId: z.string('The cashRegisterId property must be of type string!'),
    clientId: z.string('The clientId property must be of type string!'),
})

export class CashRegisterController {
    // GET /api/cash-registers
    index: Handler = (req, res) => { res.json(CashRegister.getAll()) }
    
    // GET /api/cash-registers/cashiers
    cashiers: Handler = (req, res) => { res.json(CashRegister.getAllCashiers()) }

    // GET /api/cash-registers/:id
    find: Handler = (req, res) => {
        const { id } = req.params;
        const cashRegister = CashRegister.getById(id);
        res.json(cashRegister);
    }

    // POST /api/cash-registers
    create: Handler = (req, res) => {
        const cashRegisterAtts = registerCashRegisterZ.parse({
            ...req.body,
            id: uuid()
        });

        const cashRegister = CashRegister.newCashRegister(cashRegisterAtts);
        res.status(201).json(cashRegister);  
    }

    // POST /api/cash-registers/new-purchase/:cashRegisterId/:clientId
    createPurchase: Handler = (req, res) => {
        const { cashRegisterId, clientId } = req.params;
        const newPurchaseAtts = newPurchaseSchema.parse({
            ...req.body,
            id: uuid(),
            clientId: clientId,
            cashRegisterId: cashRegisterId
        });
        const newPurchase = CashRegister.newPurchase(newPurchaseAtts);
        res.status(201).json(newPurchase);
    }

    // PUT /api/cash-registers/:id
    edit: Handler = (req, res) => {
        const { id } = req.params;
        const attributesToEdit = editCashRegisterZ.parse({...req.body});
        const editedCashRegister = CashRegister.editCashRegister(id, attributesToEdit);
        res.json(editedCashRegister);
    }

    // PUT /api/cash-register/:id/empty-funds
    emptyFunds: Handler = (req, res) => {
        const { id } = req.params;
        const cashRegister = CashRegister.emptyFunds(id);
        res.json(cashRegister);
    }

    // DELETE /api/cash-registers/:id
    delete: Handler = (req, res) => {
        const { id } = req.params;
        const deletedCashRegister = CashRegister.deleteCashRegister(id);
        res.json(deletedCashRegister);
    }

    // DELETE /api/cash-registers/reverse-purchase/:cashRegisterId/:purchaseId
    deletePurchase: Handler = (req, res) => {
        const { cashRegisterId, purchaseId } = req.params;
        const deletedPurchase = CashRegister.reversePurchase(cashRegisterId, purchaseId);
        res.json(deletedPurchase);
    }
}