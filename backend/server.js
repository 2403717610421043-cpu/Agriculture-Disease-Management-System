require('dotenv').config();
const express=require('express');
const cors=require('cors');
const path=require('path');
const db=require('./config/db');

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.get('/api/health',async(req,res)=>{
  try{await db.query('SELECT 1');res.json({status:'ok'});}
  catch(e){res.status(500).json({status:'database error'});}
});

app.use('/api/auth',require('./routes/auth'));
app.use('/api/crops',require('./routes/crops'));
app.use('/api/reports',require('./routes/reports'));
app.use('/api/diseases',require('./routes/diseases'));
app.use('/api/tips',require('./routes/tips'));
app.use('/api/queries',require('./routes/queries'));
app.use('/api/notifications',require('./routes/notifications'));
app.use('/api/research',require('./routes/research'));
app.use('/api/admin',require('./routes/admin'));
app.use('/api/analytics',require('./routes/analytics'));

app.use((err,req,res,next)=>{
  if(err) return res.status(400).json({message:err.message||'Request failed'});
  next();
});

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Backend running on port ${PORT}`));
