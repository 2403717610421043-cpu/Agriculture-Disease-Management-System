const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const {auth} = require('../middleware/auth');

router.post('/register', async (req,res)=>{
  try {
    const {name,email,password,role='farmer',phone,address} = req.body;
    if (!name || !email || !password) return res.status(400).json({message:'Name, email and password are required'});
    if (role !== 'farmer') return res.status(400).json({message:'Public registration is available for farmers'});
    const [existing] = await db.query('SELECT id FROM users WHERE email=?',[email]);
    if (existing.length) return res.status(409).json({message:'Email already registered'});
    const hash = await bcrypt.hash(password,10);
    const [r] = await db.query('INSERT INTO users(name,email,password,role,phone,address) VALUES(?,?,?,?,?,?)',[name,email,hash,role,phone||null,address||null]);
    await db.query('INSERT INTO farmer_profiles(user_id) VALUES(?)',[r.insertId]);
    res.status(201).json({message:'Registration successful'});
  } catch(e){res.status(500).json({message:'Registration failed'});}
});

router.post('/login', async (req,res)=>{
  try {
    const {email,password} = req.body;
    const [rows] = await db.query('SELECT id,name,email,password,role,is_active FROM users WHERE email=?',[email]);
    if (!rows.length) return res.status(401).json({message:'Invalid email or password'});
    const u=rows[0];
    if (!u.is_active) return res.status(403).json({message:'Account is inactive'});
    const ok=await bcrypt.compare(password,u.password);
    if (!ok) return res.status(401).json({message:'Invalid email or password'});
    const token=jwt.sign({id:u.id,name:u.name,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:'8h'});
    res.json({token,user:{id:u.id,name:u.name,email:u.email,role:u.role}});
  } catch(e){res.status(500).json({message:'Login failed'});}
});

router.get('/me',auth,async(req,res)=>{
  const [rows]=await db.query('SELECT id,name,email,role,phone,address,is_active,created_at FROM users WHERE id=?',[req.user.id]);
  res.json(rows[0]);
});

module.exports=router;
