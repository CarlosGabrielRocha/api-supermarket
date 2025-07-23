import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { usersRouter } from "./routes/usersRouter";
import { errorHandler } from "./middlewares/errorHandler"; 
import { authRouter } from "./routes/authRouter";
import { productRouter } from "./routes/productRouter";
import { purchaseRouter } from "./routes/purchaseRouter";
import { cashRegisterRouter } from "./routes/cashRegisterRouter";

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productRouter);
app.use('/api/purchases', purchaseRouter);
app.use('/api/cash-registers', cashRegisterRouter);

app.use(errorHandler); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`WELCOME TO SUPERMARKET API\n Server running on http://localhost:${PORT}`));

