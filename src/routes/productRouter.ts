import express from "express";
import { ensureAuthentication, ensureIsAdmin, managerOnly } from "../middlewares/authMiddlewares";
import { ProductController } from "../controllers/ProductController";

export const productRouter = express.Router()

productRouter.use(ensureAuthentication)

const productController = new ProductController()

productRouter.get('/', productController.index)
productRouter.get('/:id', productController.find)

productRouter.post('/', ensureIsAdmin, productController.create)

productRouter.put('/:id', ensureIsAdmin, productController.edit)

productRouter.delete('/:id', managerOnly, productController.delete)