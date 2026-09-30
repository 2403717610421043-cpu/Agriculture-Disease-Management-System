const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/',auth,roles('farmer'),async(req,res)=>{
  const [rows]=await db.query('SELECT * FROM crops WHERE farmer_id=? ORDER BY created_at DESC',[req.user.id]);
  res.json(rows);
});

router.post('/',auth,roles('farmer'),async(req,res)=>{
  const {crop_name,variety,planting_date,area}=req.body;
  if(!crop_name) return res.status(400).json({message:'Crop name is required'});
  await db.query('INSERT INTO crops(farmer_id,crop_name,variety,planting_date,area) VALUES(?,?,?,?,?)',[req.user.id,crop_name,variety||null,planting_date||null,area||null]);
  res.status(201).json({message:'Crop added'});
});

module.exports=router;
