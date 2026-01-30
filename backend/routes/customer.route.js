const express = require('express');
const connectToDb = require('../config/db');
const router = express.Router();

// router.get(`/$id`, async(req, res)=>{
//     try{
        
//     }catch (e){
//         res.status(500).json({error: e.message});
//     }
// })

router.get('/', async (req, res)=>{
    try {
        const connection = await connectToDb();
        const [users] = await connection.execute('select * from customer');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/savecustomer', async (req, res) => {
  try {
    const connection = await connectToDb();
    const [result] = await connection.execute(
      'UPDATE customer SET email = ? WHERE customerName = ?',
      [req.body.email, req.body.customerName]
    );
    res.json('Updated Successfully');
  } catch (e) {
    res.json({'error' : e.message});
  }
});

module.exports = router;
