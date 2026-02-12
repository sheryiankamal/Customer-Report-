const express = require("express");
const connectToDb = require("../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs=  require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now()+ path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await connectToDb();
    const [rows] = await connection.execute(
      "SELECT id, customerName, Pc, Ac, email, loyaltyPoints, country, state, pincode, company, Status, updatedOn, role FROM customer",
    );
    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
  } finally {
    // Always close/release connection if not using a managed pool
    if (connection) await connection.end();
  }
});

router.put("/savecustomer", async (req, res) => {
  try {
    console.log(req.body.customer.id, req.body.id);
    const connection = await connectToDb();
    const [result] = await connection.execute(
      `UPDATE customer 
       SET customerName = ?, 
       Pc = ?, 
       Ac = ?, 
       loyaltyPoints = ?, 
       country = ?, 
       state = ?, 
       pincode = ?, 
       company = ?, 
       Status = ?
       WHERE id = ?`,
      [
        req.body.customer.customerName,
        req.body.customer.Pc,
        req.body.customer.Ac,
        req.body.customer.loyaltyPoints,
        req.body.customer.country,
        req.body.customer.state,
        req.body.customer.pincode,
        req.body.customer.company,
        req.body.customer.Status,
        req.body.customer.id,
      ],
    );
    const [rows] = await connection.execute(
      "Select * from customer where id = ?",
      [req.body.customer.id],
    );
    console.log(rows);

    if (req.body.customer.role == "admin") {
      const [noti] = await connection.execute(
        "insert into notifications (user_id, message, type) values (?, ?, ?)",
        [
          req.body.customer.id,
          "Your personal details were changed successfully",
          "Details",
        ],
      );
    } else {
      const [noti] = await connection.execute(
        "insert into notifications (user_id, message, type) values (?, ?, ?)",
        [
          req.body.customer.id,
          "Your personal details were changed by backend successfully",
          "Details",
        ],
      );
    }
    res.json("Updated Successfully");
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  let connection;
  try {
    connection = await connectToDb();
    const { email, password } = req.body;
    const [rows] = await connection.execute(
      "SELECT * FROM customer where email = ?",
      [email],
    );

    console.log(rows[0]);
    console.log(rows.length);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (rows[0].password === password) {
      const token = jwt.sign({ email }, "secret");
      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 3600000,
      });
      return res.status(200).json(rows[0]);
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (e) {
    console.log("loggin in error", e);
  }
});

router.get("/login", (req, res) => {
  console.log(req.cookies.token);
  const token = req.cookies.token;
  jwt.verify(token, "secret", async (e, result) => {
    console.log("res", result);
    if (!e) {
      const connection = await connectToDb();
      const [rows] = await connection.execute(
        "SELECT * FROM customer where email = ?",
        [result.email],
      );
      res.status(200).json(rows[0]);
    }
  });
});

router.put("/saveUpdates", async (req, res) => {
  console.log(req.body);
  try {
    const connection = await connectToDb();
    const [result] = await connection.execute(
      "UPDATE customer SET state = ?, customerName= ? WHERE id = ?",
      [req.body.state, req.body.name, req.body.id],
    );
    if (result[0].role === "admin") {
      const [noti] = await connection.execute(
        "insert into notifications (user_id, message, type) values (?, ?, ?)",
        [
          req.body.id,
          "Your name and state was changed successfully",
          "Details",
        ],
      );
    }
    console.log(result);
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.put("/savePassword", async (req, res) => {
  console.log(req.body);
  try {
    const connection = await connectToDb();
    const [result] = await connection.execute(
      "UPDATE customer SET password = ? WHERE id = ?",
      [req.body.password, req.body.id],
    );
    if (result[0].role === "admin") {
      const [noti] = await connection.execute(
        "insert into notifications (user_id, message, type) values (?, ?, ?)",
        [req.body.id, "Your password was changed successfully", "Security"],
      );
    }
    console.log(result);
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.get("/notifications/:user_id", async (req, res) => {
  try {
    const connection = await connectToDb();
    const [rows] = await connection.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.user_id],
    );
    console.log(rows);
    res.json(rows);
  } catch (e) {
    console.log(e);
  }
});

router.post('/upload-profile', upload.single('profile'), async(req, res)=>{
  console.log(req.body.userId)
  //console.log(req.file);
  try{
    const connection = await connectToDb();
    const imagePath = req.file.filename;
    
    const[rows] = await connection.execute(
      'select * from customer where id = ?',
      [req.body.userId],
    )

    const oldImage = rows[0]?.profileImage;

    if(oldImage){
      const oldImagePath = path.join(__dirname, '..' , 'uploads', oldImage);
      if(fs.existsSync(oldImagePath)){
        fs.unlinkSync(oldImagePath);
      }
    }
    
    const result = await connection.execute(
      "update customer set profileImage = ? where id = ?",
      [imagePath, req.body.userId]
    )
    res.json({
      message: 'Profile uploaded successfully',
      image: imagePath,
    });
  }catch(e){
    console.log(e)
    res.status(500).json({
      message: 'Upload failed',
    })
  }
})

router.post('/message', async(req, res)=>{
  const {rId, sId, m} = req.body;
  try{
    const connection = await connectToDb();
    const [result] = await connection.execute(
      'insert into messages (sender_id, receiver_id, message) values (?, ?, ?)',
      [sId, rId, m]
    );
    res.json({'msg': 'successful'});
  }catch(e){
    console.log(e);
  }
})

router.get('/getMsg/:sId/:rId', async(req, res)=>{
  let connection;
  try{
    connection = await connectToDb();
    const [rows]= await connection.execute(
      "select * from messages where (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
      [req.params.sId, req.params.rId, req.params.rId, req.params.sId]
    )
    console.log('m', rows);
    res.json({rows});
  }catch(e){
    res.json({'rows':'No chats'});
    console.log(e);
  }finally {
  if (connection) {
    try{
      await connection.end();
      console.log('closed')
    }catch(e){
      console.log(e);
    }
  }
}
})

module.exports = router;
