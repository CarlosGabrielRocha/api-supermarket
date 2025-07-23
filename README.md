# api-supermarket
A project that simulates a supermarket API created for practice and study purposes.

## Routes

### Authentication Routes

**Possible object properties in JSON:**

```
User {
    "name": string;
    "email": string;
    "password": string;
}
```

| Method | Route             | Description  |   Access Level   |
|--------|-------------------|--------------|------------------|
| GET    | `/auth/register`  | Registration | Public           |
| GET    | `/auth/login`     | Login        | Public           |

**There's a pre-registered user with manager role for easy testing:**

```
"id": '1',
"name": 'managerUser',
"email": 'manager@gmail.com',
"password": 123456,
"role": 'manager'
```

> [!NOTE]
> Authentication is required for the routes below. Some are accessible to any user, others are 
> restricted to admins only, and some are exclusively for users with the manager role.

### Users Routes

**Possible object properties in JSON:**

```
User {
    "name": string;
    "email": string;
    "password": string;
    "role"?: 'client' | 'admin' | 'manager';
}
```
| Method | Route                     | Description                       | Access Level     |
|--------|---------------------------|-----------------------------------|------------------|
| GET    | `/api/users`              | Get all users                     | Managers only    |
| GET    | `/api/users/admins`       | Get all admin users               | Managers only    |
| GET    | `/api/users/managers`     | Get all manager users             | Managers only    |
| GET    | `/api/users/:id`          | Get a user by ID                  | Admins           |
| POST   | `/api/users`              | Create a new user                 | Managers only    |
| PUT    | `/api/users/:id`          | Update an existing user           | Managers only    |
| DELETE | `/api/users/:id`          | Delete a user                     | Managers only    |

### Products Routes

**Possible object properties in JSON:**

```
Product {
    "name": string;
    "price": number;
    "category": 'cleaning' | 'food' | 'utensil';
    "availableQuantity": number;
}
```

| Method | Route               | Description                 | Access Level             |
|--------|---------------------|-----------------------------|---------------------------|
| GET    | `/api/products`     | List all products           | Any authenticated user    |
| GET    | `/api/products/:id` | Get a product by ID         | Any authenticated user    |
| POST   | `/api/products`     | Create a new product        | Admins                    |
| PUT    | `/api/products/:id` | Update an existing product  | Admins                    |
| DELETE | `/api/products/:id` | Delete a product            | Managers only             |

**Pre-registered products:**

```
[
  { "id": "1", "name": "Stainless steel flatware set - 24 pieces", "price": 89.90, "category": "utensil", "availableQuantity": 27 },
  { "id": "2", "name": "Pressure cooker 4.5L", "price": 139.99, "category": "utensil", "availableQuantity": 12 },
  { "id": "3", "name": "Silicone spatula", "price": 14.50, "category": "utensil", "availableQuantity": 38 },
  { "id": "4", "name": "Bamboo cutting board", "price": 34.90, "category": "utensil", "availableQuantity": 23 },
  { "id": "5", "name": "Glass set - 6 pieces", "price": 49.99, "category": "utensil", "availableQuantity": 19 },
  { "id": "6", "name": "Multipurpose sponge", "price": 1.10, "category": "cleaning", "availableQuantity": 42 },
  { "id": "7", "name": "Floral disinfectant 500ml", "price": 3.80, "category": "cleaning", "availableQuantity": 35 },
  { "id": "8", "name": "Bar soap - 5 units", "price": 6.20, "category": "cleaning", "availableQuantity": 16 },
  { "id": "9", "name": "Bleach 1L", "price": 2.75, "category": "cleaning", "availableQuantity": 29 },
  { "id": "10", "name": "Furniture polish 200ml", "price": 5.90, "category": "cleaning", "availableQuantity": 10 },
  { "id": "11", "name": "White rice 1kg", "price": 4.50, "category": "food", "availableQuantity": 46 },
  { "id": "12", "name": "Carioca beans 1kg", "price": 6.10, "category": "food", "availableQuantity": 33 },
  { "id": "13", "name": "Spaghetti pasta 500g", "price": 3.20, "category": "food", "availableQuantity": 25 },
  { "id": "14", "name": "Chocolate drink powder 200g", "price": 4.80, "category": "food", "availableQuantity": 18 },
  { "id": "15", "name": "Breakfast cereal 300g", "price": 7.90, "category": "food", "availableQuantity": 39 }
]

```

### Purchases Routes

**Possible object properties in JSON:**

| Method | Route               | Description              | Access Level     |
|--------|---------------------|--------------------------|------------------|
| GET    | `/api/purchases`     | List all purchases       | Admins           |
| GET    | `/api/purchases/:id` | Get a purchase by ID     | Admins           |

### Cash Registers Routes

**Possible object properties in JSON:**

```
CashRegister {
    "adminId": string;
    "availableFunds": number;
}
```

| Method | Route                                                                 | Description                                      | Access Level       |
|--------|-----------------------------------------------------------------------|-------------------------------------------------|--------------------|
| GET    | `/api/cash-registers`                                                 | List all cash registers                          | Managers only      |
| GET    | `/api/cash-registers/cashiers`                                       | List all cashiers assigned to cash registers    | Managers only      |
| GET    | `/api/cash-registers/:id`                                             | Get a specific cash register by ID               | Managers only      |
| POST   | `/api/cash-registers`                                                 | Create a new cash register                       | Managers only      |
| POST   | `/api/cash-registers/new-purchase/:cashRegisterId/:clientId`         | Create a new purchase    | Admins        |
| PUT    | `/api/cash-registers/:id`                                             | Update a cash register                           | Managers only      |
| PUT    | `/api/cash-registers/:id/empty-funds`                                | Empty funds from a cash register                 | Managers only      |
| DELETE | `/api/cash-registers/:id`                                             | Delete a cash register                           | Managers only      |
| DELETE | `/api/cash-registers/reverse-purchase/:cashRegisterId/:purchaseId`   | Reverse a purchase          | Managers only      |