const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/',auth,async(req,res)=>{
  const q=req.query.q||'';
  const [rows]=await db.query('SELECT * FROM diseases WHERE disease_name LIKE ? OR crop LIKE ? ORDER BY disease_name',['%'+q+'%','%'+q+'%']);
  res.json(rows);
});

router.post('/',auth,roles('admin'),async(req,res)=>{
  const {disease_name,crop,symptoms,causes,prevention,treatment,description}=req.body;
  await db.query('INSERT INTO diseases(disease_name,crop,symptoms,causes,prevention,treatment,description) VALUES(?,?,?,?,?,?,?)',[disease_name,crop,symptoms,causes,prevention,treatment,description]);
  res.status(201).json({message:'Disease added'});
});

router.put('/:id',auth,roles('admin'),async(req,res)=>{
  const {disease_name,crop,symptoms,causes,prevention,treatment,description}=req.body;
  await db.query('UPDATE diseases SET disease_name=?,crop=?,symptoms=?,causes=?,prevention=?,treatment=?,description=? WHERE id=?',[disease_name,crop,symptoms,causes,prevention,treatment,description,req.params.id]);
  res.json({message:'Disease updated'});
});

router.delete('/:id',auth,roles('admin'),async(req,res)=>{
  await db.query('DELETE FROM diseases WHERE id=?',[req.params.id]);
  res.json({message:'Disease deleted'});
});

module.exports=router;
