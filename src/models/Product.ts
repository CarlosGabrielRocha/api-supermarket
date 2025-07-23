import { HttpError } from "../errors/HttpError";

export type ProductCategory = 'cleaning' | 'food' | 'utensil';

interface ProductAttributes {
    id: string;
    name: string;
    price: number;
    category: ProductCategory;
    availableQuantity: number;
}

interface OptionalProductAttributes {
    name?: string;
    price?: number;
    category?: ProductCategory;
    availableQuantity?: number;
}

export class Product {
    private static products: Product[] = [
        new Product({ id: '1', name: 'Stainless steel flatware set - 24 pieces', price: 89.90, category: 'utensil', availableQuantity: 27 }),
        new Product({ id: '2', name: 'Pressure cooker 4.5L', price: 139.99, category: 'utensil', availableQuantity: 12 }),
        new Product({ id: '3', name: 'Silicone spatula', price: 14.50, category: 'utensil', availableQuantity: 38 }),
        new Product({ id: '4', name: 'Bamboo cutting board', price: 34.90, category: 'utensil', availableQuantity: 23 }),
        new Product({ id: '5', name: 'Glass set - 6 pieces', price: 49.99, category: 'utensil', availableQuantity: 19 }),
        new Product({ id: '6', name: 'Multipurpose sponge', price: 1.10, category: 'cleaning', availableQuantity: 42 }),
        new Product({ id: '7', name: 'Floral disinfectant 500ml', price: 3.80, category: 'cleaning', availableQuantity: 35 }),
        new Product({ id: '8', name: 'Bar soap - 5 units', price: 6.20, category: 'cleaning', availableQuantity: 16 }),
        new Product({ id: '9', name: 'Bleach 1L', price: 2.75, category: 'cleaning', availableQuantity: 29 }),
        new Product({ id: '10', name: 'Furniture polish 200ml', price: 5.90, category: 'cleaning', availableQuantity: 10 }),
        new Product({ id: '11', name: 'White rice 1kg', price: 4.50, category: 'food', availableQuantity: 46 }),
        new Product({ id: '12', name: 'Carioca beans 1kg', price: 6.10, category: 'food', availableQuantity: 33 }),
        new Product({ id: '13', name: 'Spaghetti pasta 500g', price: 3.20, category: 'food', availableQuantity: 25 }),
        new Product({ id: '14', name: 'Chocolate drink powder 200g', price: 4.80, category: 'food', availableQuantity: 18 }),
        new Product({ id: '15', name: 'Breakfast cereal 300g', price: 7.90, category: 'food', availableQuantity: 39 }),
    ]
    private _id: string;
    private _name: string;
    private _price: number;
    private _availableQuantity: number;
    private category: ProductCategory;

    get id() {
        return this._id
    }

    get name() {
        return this._name
    }

    get price() {
        return this._price
    }

    get availableQuantity() {
        return this._availableQuantity
    }

    constructor(attributes: ProductAttributes) {
        this._id = attributes.id;
        this._name = attributes.name;
        this._price = attributes.price;
        this._availableQuantity = attributes.availableQuantity;
        this.category = attributes.category;
    }

    public static getAll() {
        const products = Product.products.map((product => {
            return this.getById(product.id)
        }));
        return products;
    }

    public static getByName(name: string) {
        const product = this.products.find(product => product.name === name)
        if (!product) throw new HttpError(404, 'Product not found!');
        return this.getById(product.id)
    }

    public static getFullById(id: string): Product {
        const product = Product.products.find(product => product.id === id);
        if (!product) throw new HttpError(404, `Product ${id} not found!`);
        return product
    }

    public static getById(id: string) {
        const product = this.getFullById(id);
        return {
            id: product._id,
            name: product._name,
            price: product._price,
            quantityAvailable: product._availableQuantity
        }
    }

    public static registerProduct(attributes: ProductAttributes) {
        const productInstance = new Product(attributes);
        Product.products.push(productInstance);
        return this.getById(attributes.id);
    }

    public static editProduct(id: string, attributes: OptionalProductAttributes) {
        const product = Product.products.find(product => product.id === id);
        if (!product) throw new HttpError(404, 'Product not found!');
        if (attributes.name) product._name = attributes.name;
        if (attributes.price) product._price = attributes.price;
        if (attributes.category) product.category = attributes.category;
        if (typeof attributes.availableQuantity === 'number') 
            product._availableQuantity = attributes.availableQuantity;
        return this.getById(id);
    }

    public static deleteProduct(id: string) {
        const product = this.products.find(product => product.id === id);
        if (!product) throw new HttpError(404, 'Product not found!');
        const deletedProduct = this.getById(id);
        this.products = Product.products.filter(product => product.id !== id);
        return deletedProduct;
    }

    public decreaseQuantity() {
        return this._availableQuantity--;
    }

    public increaseQuantity() {
        return this._availableQuantity++;
    }

}