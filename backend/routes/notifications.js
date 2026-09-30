const router=require('express').Router();
const db=require('../config/db');
const {auth}=require('../middleware/auth');

router.get('/',auth,async(req,res)=>{
  const [rows]=await db.query('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 30',[req.user.id]);
  res.json(rows);
});

router.put('/:id/read',auth,async(req,res)=>{
  await db.query('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?',[req.params.id,req.user.id]);
  res.json({message:'Notification marked as read'});
});

module.exports=router;
