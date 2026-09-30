const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/users',auth,roles('admin'),async(req,res)=>{
  const [rows]=await db.query('SELECT id,name,email,role,phone,address,is_active,created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

router.put('/users/:id/status',auth,roles('admin'),async(req,res)=>{
  await db.query('UPDATE users SET is_active=? WHERE id=?',[req.body.is_active?1:0,req.params.id]);
  res.json({message:'User status updated'});
});

module.exports=router;
