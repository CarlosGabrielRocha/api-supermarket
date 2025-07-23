import express from "express";
import { ensureAuthentication, ensureIsAdmin, managerOnly } from "../middlewares/authMiddlewares";
import { CashRegisterController } from "../controllers/CashRegisterController";

export const cashRegisterRouter = express.Router();

cashRegisterRouter.use(ensureAuthentication);

const cashRegisterController = new CashRegisterController();

cashRegisterRouter.get('/', managerOnly, cashRegisterController.index);
cashRegisterRouter.get('/cashiers', managerOnly, cashRegisterController.cashiers);
cashRegisterRouter.get('/:id', cashRegisterController.find);

cashRegisterRouter.post('/', managerOnly, cashRegisterController.create);
cashRegisterRouter.post('/new-purchase/:cashRegisterId/:clientId', ensureIsAdmin, cashRegisterController.createPurchase);

cashRegisterRouter.put('/:id', managerOnly, cashRegisterController.edit);
cashRegisterRouter.put('/:id/empty-funds', managerOnly, cashRegisterController.emptyFunds);

cashRegisterRouter.delete('/:id', managerOnly, cashRegisterController.delete);
cashRegisterRouter.delete('/reverse-purchase/:cashRegisterId/:purchaseId', managerOnly, cashRegisterController.deletePurchase);
