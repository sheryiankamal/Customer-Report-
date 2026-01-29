const express = require('express');
const connectToDb = require('../config/db');
const router = express.Router();

router.get(`/$id`, async(req, res)=>{
    try{
        
    }catch (e){
        res.status(500).json({error: e.message});
    }
})

router.get('/', async (req, res)=>{
    try {
        const connection = await connectToDb();
        const [users] = await connection.execute('select * from customer');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
