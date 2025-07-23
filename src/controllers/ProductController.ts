import z from "zod/v4";
import { v4 as uuid } from "uuid";
import { Handler } from "express";
import { Product } from "../models/Product";

const registerProductSchema = z.object({
    id: z.uuidv4(),
    name: z.string('The name property must be of type string!').refine( name => {
        const product = Product.getAll().find(product => product.name === name);
        if (!product) return true;
        else return false;
    }, { error: 'A product with this name already exists!' }).min(2, { error: 'Invalid name!' }),
    price: z.number('The price property must be of type number!').positive('The price must be  greater than 0'),
    category: z.literal(['cleaning', 'food', 'utensil'], { error: 'The category property must be of type cleaning, food or utensil' }),
    availableQuantity: z.int('The availableQuantity property must be of type integer!').nonnegative('The availableQuantity cant be less than 0')
})

const editProductSchema = z.object({
    name: z.string('The name property must be of type string!').refine( name => {
        const product = Product.getAll().find(product => product.name === name);
        if (!product) return true;
        else return false;    
    }, { error: 'A product with this name already exists!' }).min(2, { error: 'Invalid name!' }).optional(),
    price: z.number('The price property must be of type number!').positive('The price must be  greater than 0').optional(),
    category: z.literal(['cleaning', 'food', 'utensil'], { error: 'The category property must be of type cleaning, food or utensil' }).optional(),
    availableQuantity: z.int('The availableQuantity property must be of type integer!').nonnegative('The availableQuantity cant be less than 0').optional()
})

export class ProductController {
    // GET /api/products
    index: Handler = (req, res) => { res.json(Product.getAll()) }

    // GET /api/products/:id
    find: Handler = (req, res) => {
        const { id } = req.params;
        const product = Product.getById(id);
        res.json(product);
    }

    // POST /api/products
    create: Handler = (req, res) => {
        const productAttributes = registerProductSchema.parse({
            ...req.body,
            id: uuid(),
        })

        const createdProduct = Product.registerProduct(productAttributes);
        res.status(201).json(createdProduct);
    }

    // PUT /api/products/:id
    edit: Handler = (req, res) => {
        const { id } = req.params;
        const infoToEdit = editProductSchema.parse(req.body);
        const editedProduct = Product.editProduct(id, infoToEdit);
        res.json(editedProduct);
    }

    // DELETE /api/products/:id
    delete: Handler = (req, res) => {
        const { id } = req.params;
        const deletedProduct = Product.deleteProduct(id);
        res.json(deletedProduct);
    }
}
