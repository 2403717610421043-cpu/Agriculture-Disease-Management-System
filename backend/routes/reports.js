const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');
const upload=require('../middleware/upload');

router.get('/',auth,async(req,res)=>{
  let sql=`SELECT r.*, u.name farmer_name,
           d.diagnosis,d.treatment,d.recommendation,d.created_at diagnosis_date,
           dis.disease_name
           FROM disease_reports r
           JOIN users u ON u.id=r.farmer_id
           LEFT JOIN diagnoses d ON d.report_id=r.id
           LEFT JOIN diseases dis ON dis.id=d.disease_id`;
  let params=[];
  if(req.user.role==='farmer'){sql+=' WHERE r.farmer_id=?';params=[req.user.id];}
  sql+=' ORDER BY r.created_at DESC';
  const [rows]=await db.query(sql,params);
  res.json(rows);
});

router.post('/',auth,roles('farmer'),upload.single('image'),async(req,res)=>{
  const {crop_id,crop_name,symptoms,description}=req.body;
  if(!crop_name || !symptoms) return res.status(400).json({message:'Crop and symptoms are required'});
  const image=req.file ? '/uploads/'+req.file.filename : null;
  const [r]=await db.query('INSERT INTO disease_reports(farmer_id,crop_id,crop_name,symptoms,description,image_path) VALUES(?,?,?,?,?,?)',[req.user.id,crop_id||null,crop_name,symptoms,description||null,image]);
  await db.query('INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)',[req.user.id,'Disease report submitted','Your disease report has been submitted for expert review.']);
  const [experts]=await db.query("SELECT id FROM users WHERE role='expert' AND is_active=1");
  for(const e of experts) await db.query('INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)',[e.id,'New disease report','A farmer has submitted a new disease report.']);
  res.status(201).json({message:'Disease report submitted',id:r.insertId});
});

router.put('/:id/diagnose',auth,roles('expert'),async(req,res)=>{
  const {disease_id,diagnosis,treatment,recommendation,status='Treatment Recommended'}=req.body;
  if(!diagnosis) return res.status(400).json({message:'Diagnosis is required'});
  const [reports]=await db.query('SELECT farmer_id FROM disease_reports WHERE id=?',[req.params.id]);
  if(!reports.length) return res.status(404).json({message:'Report not found'});
  await db.query('INSERT INTO diagnoses(report_id,expert_id,disease_id,diagnosis,treatment,recommendation) VALUES(?,?,?,?,?,?)',[req.params.id,req.user.id,disease_id||null,diagnosis,treatment||null,recommendation||null]);
  await db.query('UPDATE disease_reports SET status=? WHERE id=?',[status,req.params.id]);
  await db.query('INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)',[reports[0].farmer_id,'Diagnosis completed','Your disease report has been reviewed and a diagnosis/recommendation is available.']);
  res.json({message:'Diagnosis saved'});
});

module.exports=router;
