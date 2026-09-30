const router=require('express').Router();
const db=require('../config/db');
const {auth,roles}=require('../middleware/auth');

router.get('/',auth,roles('admin','scientist','expert'),async(req,res)=>{
  const [[users]] = await db.query("SELECT COUNT(*) total FROM users");
  const [[farmers]] = await db.query("SELECT COUNT(*) total FROM users WHERE role='farmer'");
  const [[experts]] = await db.query("SELECT COUNT(*) total FROM users WHERE role='expert'");
  const [[reports]] = await db.query("SELECT COUNT(*) total FROM disease_reports");
  const [[pending]] = await db.query("SELECT COUNT(*) total FROM disease_reports WHERE status='Pending'");
  const [diseaseStats] = await db.query("SELECT COALESCE(dis.disease_name,'Unclassified') disease,COUNT(*) total FROM disease_reports r LEFT JOIN diagnoses d ON d.report_id=r.id LEFT JOIN diseases dis ON dis.id=d.disease_id GROUP BY disease ORDER BY total DESC");
  res.json({users:users.total,farmers:farmers.total,experts:experts.total,reports:reports.total,pending:pending.total,diseaseStats});
});

module.exports=router;
