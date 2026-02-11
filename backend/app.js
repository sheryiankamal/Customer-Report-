const express = require('express');
const app = express();
const cookieParser= require('cookie-parser');
const path = require('path');

app.use(cookieParser())

const cors = require('cors')
const customerRouter = require('./routes/customer.route');

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true       
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/customer', customerRouter);
app.use('/uploads', express.static("uploads"))

app.get('/', (req, res) => {
    console.log('welcome')
})

app.listen(3000, (
    console.log('running')
));

