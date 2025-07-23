import { HttpError } from "../errors/HttpError";
import { CashRegister } from "./CashRegister";
import { Product } from "./Product";
import { User } from "./User";

export interface PurchaseAttributes {
    id: string;
    products: Product[];
    total: number;
    buyer: User;
    purchaseDate: Date;
    cashRegister: CashRegister;
}

export class Purchase {
    private static purchases: Purchase[] = [];
    private _id: string;
    private _total: number;
    private _products: Product[] = [];
    private _buyer: User;
    private _purchaseDate: Date;
    private _cashRegister: CashRegister;

    get id() {
        return this._id;
    }
    
    get total() {
        return this._total;
    }

    get products() {
        return this._products.map(product => {
            return {
                id: product.id,
                name: product.name,
                price: product.price
            }
        })
    }

    get buyer() {
        return User.getById(this._buyer.id);
    }

    get purchaseDate() {
        return this._purchaseDate;
    }

    get cashRegisterId() {
        return this._cashRegister.id;
    }

    constructor(attributes: PurchaseAttributes) {
        this._id = attributes.id;
        this._total = attributes.total;
        this._products = attributes.products;
        this._buyer = attributes.buyer;
        this._purchaseDate = attributes.purchaseDate;
        this._cashRegister = attributes.cashRegister;
    }

    public static getAll() {
        const users = Purchase.purchases.map((purchase => {
            return {
                id: purchase.id,
                total: purchase.total,
                products: purchase.products,
                buyer: purchase.buyer,
                purchaseDate: purchase.purchaseDate
            }
        }));
        return users;
    }

    public static getById(id: string) {
        const purchase = this.purchases.find(purchase => purchase.id === id);
        if (!purchase) throw new HttpError(404, 'Purchase not found!');
        return {
            id: purchase._id,
            total: purchase.total,
            products: purchase.products,
            buyer: purchase.buyer,
            purchaseDate: purchase.purchaseDate,
            cashRegisterId: purchase._cashRegister.id
        }
    }

    public static newPurchase(attributes: PurchaseAttributes) {
        attributes.products.forEach(product => {
            if (product.availableQuantity <= 0) 
                throw new HttpError(405, `Product ${product.name} is unavailable!`)
            else
               Product.getFullById(product.id).decreaseQuantity(); 
        })

        const purchase = new Purchase(attributes);
        
        this.purchases.push(purchase);
        return purchase;
    }

    public static deletePurchase(id: string) {
        const purchase = Purchase.purchases.find(purchase => purchase.id === id);
        if (!purchase) throw new HttpError(404, 'Purchase not found!');

        purchase.products.forEach(product => {
            Product.getFullById(product.id).increaseQuantity();
        })

        const deletedPurchase = Purchase.getById(id);
        Purchase.purchases = Purchase.purchases.filter(purchase => purchase.id !== id);
        return deletedPurchase;
    }
}