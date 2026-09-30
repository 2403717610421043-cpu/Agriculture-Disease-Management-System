const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/',auth,async(req,res)=>{
  const [rows]=await db.query('SELECT t.*,u.name expert_name FROM farming_tips t JOIN users u ON u.id=t.expert_id ORDER BY t.created_at DESC');
  res.json(rows);
});

router.post('/',auth,roles('expert'),async(req,res)=>{
  const {title,category,content}=req.body;
  if(!title||!category||!content) return res.status(400).json({message:'All fields are required'});
  await db.query('INSERT INTO farming_tips(expert_id,title,category,content) VALUES(?,?,?,?)',[req.user.id,title,category,content]);
  res.status(201).json({message:'Tip added'});
});

router.put('/:id',auth,roles('expert'),async(req,res)=>{
  const {title,category,content}=req.body;
  await db.query('UPDATE farming_tips SET title=?,category=?,content=? WHERE id=? AND expert_id=?',[title,category,content,req.params.id,req.user.id]);
  res.json({message:'Tip updated'});
});

module.exports=router;
