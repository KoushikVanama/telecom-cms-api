import express from 'express';
const app = express();
import fs from 'fs';
import bodyParser from 'body-parser';
import { v4 as uuid } from 'uuid';

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hi");
});

interface Customer {
    name: string,
    dob: string,
    email: string
    aadhaar: number,
    reg_date: string,
    mobile: number,
    id: string,
}

const plans: Plan[] = [
    { "name": 'Platinum365', "cost": 499, "validity": 365, status: "Active" },
    { "name": 'Gold180', "cost": 299, "validity": 180, status: "Active" },
    { "name": 'Silver90', "cost": 199, "validity": 90, status: "Active" }
];

interface Plan {
    name: string,
    cost: number,
    validity: number,
    status: 'Active' | 'Inactive',
}

// load initial customer data from cutomers.json file
let customers: any = [];
try {
    const data = fs.readFileSync('customers.json', 'utf8');
    customers = JSON.parse(data);
} catch (err) {
    console.error("Error reading customers data:", err);
}

// register new customer
app.post('/api/customers/register', (req, res) => {
    const newCustomer: Customer = req.body;
    if (!newCustomer || Object.keys(newCustomer).length == 0) {
        res.status(400).json({ message: "Request not allowed" });
    }
    newCustomer.id = uuid();
    console.log(newCustomer, "@@@@@@@@@@@@");
    customers.push(newCustomer);
    saveCustomers();
    res.status(201).json({ message: 'Customer registered successfully' });
});

// assign plan to customer
app.post('/api/customers/:customerId/assign-plan', (req, res) => {
    const customerId = req.params.customerId;
    const chosenPlan: Plan = req.body;
    const customer = customers.find((c: any) => c.id === customerId);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    const isValidPlan = plans.some((item: any) =>
        item.name === chosenPlan.name && item.cost === chosenPlan.cost && item.validity === chosenPlan.validity
    );
    if (!isValidPlan) {
        return res.status(404).json({ message: 'Incorrect plan details' });
    }
    customer.plan = chosenPlan;
    saveCustomers();
    res.json({ message: 'Plan assigned successfully' });
});

// get all customers
app.get('/api/customers', (req, res) => {
    res.json(customers);
});

// save customers data to customers.json file
function saveCustomers() {
    fs.writeFile('customers.json', JSON.stringify(customers), err => {
        if (err) {
            console.error("Error writing customers data:", err);
        }
    });
}

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`);
});

module.exports = app;