const express = require('express');
const app = express();

const cors = require('cors')

const customerRouter = require('./routes/customer.route');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use('/api/customer', customerRouter);
app.get('/', (req, res) => {
    console.log('welcome')
})

app.listen(3000, (
    console.log('running')
));

