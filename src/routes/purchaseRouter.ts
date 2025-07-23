import { PurchaseController } from "../controllers/PurchaseController";
import { ensureAuthentication, ensureIsAdmin } from "../middlewares/authMiddlewares";

const express = require('express');

export const purchaseRouter = express.Router();

purchaseRouter.use(ensureAuthentication);

const purchaseController = new PurchaseController();

purchaseRouter.get('/', ensureIsAdmin, purchaseController.index);
purchaseRouter.get('/:id', ensureIsAdmin, purchaseController.find);

