const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/',auth,async(req,res)=>{
  const [rows]=await db.query('SELECT r.*,u.name scientist_name FROM research_findings r JOIN users u ON u.id=r.scientist_id ORDER BY r.created_at DESC');
  res.json(rows);
});

router.post('/',auth,roles('scientist'),async(req,res)=>{
  const {title,crop,disease,findings,published}=req.body;
  if(!title||!findings) return res.status(400).json({message:'Title and findings are required'});
  await db.query('INSERT INTO research_findings(scientist_id,title,crop,disease,findings,published) VALUES(?,?,?,?,?,?)',[req.user.id,title,crop||null,disease||null,findings,published?1:0]);
  res.status(201).json({message:'Research finding saved'});
});

router.put('/:id',auth,roles('scientist'),async(req,res)=>{
  const {title,crop,disease,findings,published}=req.body;
  await db.query('UPDATE research_findings SET title=?,crop=?,disease=?,findings=?,published=? WHERE id=? AND scientist_id=?',[title,crop,disease,findings,published?1:0,req.params.id,req.user.id]);
  res.json({message:'Research finding updated'});
});

module.exports=router;
