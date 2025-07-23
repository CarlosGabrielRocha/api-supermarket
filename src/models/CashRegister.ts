import { HttpError } from "../errors/HttpError";
import { Admin } from "./Admin";
import { Product } from "./Product";
import { Purchase } from "./Purchase";
import { User } from "./User";

interface CashRegisterAttributes {
    id: string;
    cashier: Admin;
    availableFunds?: number;
}

interface NewCashRegister extends Omit<CashRegisterAttributes, 'cashier'> {
    adminId: string
}

interface OptCashRegisterAttributes {
    adminId?: string;
    availableFunds?: number;
}

interface NewPurchaseAttributes {
    id: string;
    productIds: string[];
    clientId: string;
    cashRegisterId: string;
}

export class CashRegister {
    private static cashRegisters: CashRegister[] = [];

    private static cashiers: Admin[] = []
    private _id: string;
    private cashier: Admin;
    private availableFunds: number = 0;
    private purchases: Purchase[] = [];

    get id() {
        return this._id
    }

    constructor(attributes: CashRegisterAttributes) {
        this._id = attributes.id;
        this.cashier = attributes.cashier;
        if (attributes.availableFunds)
            this.availableFunds = attributes.availableFunds;
    }

    public static getAll() {
        const cashRegisters = this.cashRegisters.map(cashRegister => this.getById(cashRegister.id));
        return cashRegisters;
    }

    public static getFullById(id: string) {
        const cashRegister = this.cashRegisters.find(cashRegister => cashRegister.id === id);
        if (!cashRegister) throw new HttpError(404, 'Cash Register not found!');
        return cashRegister;
    }

    public static getById(id: string) {
        const cashRegister = this.getFullById(id);  
        return {
            id: cashRegister.id,
            availableFunds: cashRegister.availableFunds,
            purchases: cashRegister.getAllPurchases(),
            cashier: {...User.getById(cashRegister.cashier.id), role: undefined}
        }
    }

    public static newCashRegister(attributes: NewCashRegister) {
        const cashier = Admin.getFullById(attributes.adminId);
        const newCashRegister = new CashRegister({ cashier: cashier, ...attributes });
        this.cashRegisters.push(newCashRegister);
        this.cashiers.push(newCashRegister.cashier);
        return this.getById(newCashRegister.id)
    }

    public static deleteCashRegister(id: string) {
        const crToDelete = this.getById(id);
        this.cashRegisters = this.cashRegisters.filter(cashRegister => cashRegister.id !== id);
        return crToDelete;
    }

    public static editCashRegister(id: string, atts: OptCashRegisterAttributes) {
        const cr = this.getFullById(id);
        if (atts.adminId) {
            this.cashiers = this.cashiers.filter(cashier => cashier.id !== cr.cashier.id);
            const newCashier = Admin.getFullById(atts.adminId);
            this.cashiers.push(newCashier);
            cr.cashier = newCashier;
        } 
        
        if (atts.availableFunds !== undefined) cr.availableFunds = atts.availableFunds;
        return this.getById(id);
    }

    public static emptyFunds(id: string) {
        const cashRegister = this.getFullById(id)
        cashRegister.availableFunds = 0;
        return CashRegister.getById(cashRegister.id);
    }

    public static getAllCashiers() {
        const cashiers = CashRegister.cashiers.map((cashier => {
            return {
                id: cashier.id,
                name: cashier.name,
                email: cashier.email,
                role: cashier.role
            }
        }));
        return cashiers;
    }

    public static newPurchase(attributes: NewPurchaseAttributes) {
        const products = attributes.productIds.map(productId => {
            return Product.getFullById(productId);
        })

        const buyer = User.getFullById(attributes.clientId);

        const cashRegister = this.getFullById(attributes.cashRegisterId);

        let total: number = 0;
        products.forEach(product => total += product.price);

        const newPurchaseAtts = {
            id: attributes.id,
            products,
            buyer,
            purchaseDate: new Date(),
            cashRegister,
            total
        }
       const newPurchase = Purchase.newPurchase(newPurchaseAtts);

        cashRegister.availableFunds += total;
        cashRegister.purchases.push(newPurchase);
        return Purchase.getById(newPurchase.id);
    }

    public static reversePurchase(cashRegisterId: string, purchaseId: string) {
        const cashRegister = this.getFullById(cashRegisterId);
        const deletedPurchase = Purchase.deletePurchase(purchaseId);
        cashRegister.purchases = cashRegister.purchases.filter(purchase => purchase.id !== purchaseId);
        cashRegister.availableFunds -= deletedPurchase.total;

        return deletedPurchase;
    }

    public getAllPurchases() {
        return this.purchases.map(purchase => {     
            return {
                id: purchase.id,
                buyer: purchase.buyer,
                products: purchase.products,
                purchaseDate: purchase.purchaseDate,
                total: purchase.total
            }
        })
    }
}
