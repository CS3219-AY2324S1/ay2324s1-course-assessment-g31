import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import db from './db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.listen(3000, () => {
  console.log(
    `⚡️[server]: Authentication Service is running at http://localhost:3000`
  );
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the authentication service.");
});

// routes
app.use("/user-services", router);

// Test database connection
db.query('SELECT * FROM public.category', (err, result) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    } 
    console.log('Connected to the database');
    console.log('Results', result.rows);
    db.end();
});



