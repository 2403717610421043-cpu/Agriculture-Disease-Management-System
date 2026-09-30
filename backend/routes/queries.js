const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/',auth,async(req,res)=>{
  let sql=`SELECT q.*,f.name farmer_name,e.name expert_name FROM queries q
           JOIN users f ON f.id=q.farmer_id LEFT JOIN users e ON e.id=q.expert_id`;
  let params=[];
  if(req.user.role==='farmer'){sql+=' WHERE q.farmer_id=?';params=[req.user.id];}
  else if(req.user.role==='expert'){sql+=" WHERE q.expert_id=? OR q.expert_id IS NULL";params=[req.user.id];}
  sql+=' ORDER BY q.created_at DESC';
  const [rows]=await db.query(sql,params);
  res.json(rows);
});

router.post('/',auth,roles('farmer'),async(req,res)=>{
  const {subject,message}=req.body;
  if(!subject||!message) return res.status(400).json({message:'Subject and message are required'});
  const [experts]=await db.query("SELECT id FROM users WHERE role='expert' AND is_active=1 LIMIT 1");
  const expertId=experts.length?experts[0].id:null;
  await db.query('INSERT INTO queries(farmer_id,expert_id,subject,message) VALUES(?,?,?,?)',[req.user.id,expertId,subject,message]);
  if(expertId) await db.query('INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)',[expertId,'New farmer query','A farmer has submitted a query.']);
  res.status(201).json({message:'Query submitted'});
});

router.put('/:id/respond',auth,roles('expert'),async(req,res)=>{
  const {response}=req.body;
  if(!response) return res.status(400).json({message:'Response is required'});
  const [rows]=await db.query('SELECT farmer_id FROM queries WHERE id=?',[req.params.id]);
  if(!rows.length) return res.status(404).json({message:'Query not found'});
  await db.query("UPDATE queries SET response=?,status='Answered',expert_id=?,responded_at=NOW() WHERE id=?",[response,req.user.id,req.params.id]);
  await db.query('INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)',[rows[0].farmer_id,'Expert response','Your query has received an expert response.']);
  res.json({message:'Response saved'});
});

module.exports=router;
