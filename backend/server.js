require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
let useDB=false; let mongoose, User, Course;
try{ mongoose=require('mongoose'); }catch(e){}
async function initDB(){
  const uri=process.env.MONGO_URI||'mongodb://localhost:27017/skillhub';
  if(!mongoose) return false;
  try{
    await mongoose.connect(uri,{serverSelectionTimeoutMS:2000});
    console.log('MongoDB connected:',uri);
    const userSchema=new mongoose.Schema({username:String,email:{type:String,unique:true},password:String,role:{type:String,default:'student'},points:{type:Number,default:10},badges:[String]});
    User=mongoose.model('User',userSchema);
    const courseSchema=new mongoose.Schema({title:String,description:String,category:String,level:String,instructor:String,price:Number,rating:Number,studentsEnrolled:Number});
    Course=mongoose.model('Course',courseSchema);
    useDB=true; return true;
  }catch(err){ console.log('Using in-memory DB:',err.message); useDB=false; return false; }
}
let users=[{_id:'1',username:'admin',email:'admin@skillhub.com',password:bcrypt.hashSync('admin123',10),role:'admin',points:100,badges:['Admin']}];
let courses=[
  {_id:'1', title:'React for Beginners', description:'Learn React from scratch', category:'Web Dev', level:'Beginner', instructor:'Mhotasin', price:0, rating:4.8, students:120, thumbnail:'https://via.placeholder.com/300'},
  {_id:'2', title:'Node.js Masterclass', description:'Backend with Node', category:'Backend', level:'Advanced', instructor:'Mhotasin', price:2000, rating:4.9, students:80, thumbnail:'https://via.placeholder.com/300'},
  {_id:'3', title:'Python for Beginners', description:'Complete Python from zero to hero with projects', category:'Programming', level:'Beginner', instructor:'Mhotasin Munna', price:1500, rating:4.9, students:0, thumbnail:'https://via.placeholder.com/300'}
];
app.get('/',(req,res)=>res.json({status:'SkillHub API running',db:useDB?'mongodb':'memory'}));
app.post('/api/auth/register',async(req,res)=>{
  const{username,email,password}=req.body;
  if(users.find(u=>u.email===email)) return res.status(400).json({error:'Email exists'});
  const newUser={_id:Date.now().toString(),username,email,password:bcrypt.hashSync(password,10),role:'student',points:10,badges:['Welcome']};
  users.push(newUser);
  const token=jwt.sign({id:newUser._id},'secret',{expiresIn:'7d'});
  res.json({token,user:newUser});
});
app.post('/api/auth/login',async(req,res)=>{
  const{email,password}=req.body;
  const user=users.find(u=>u.email===email);
  if(!user) return res.status(404).json({error:'User not found'});
  if(!bcrypt.compareSync(password,user.password)) return res.status(401).json({error:'Wrong password'});
  const token=jwt.sign({id:user._id},'secret',{expiresIn:'7d'});
  res.json({token,user});
});
app.get('/api/courses',(req,res)=>res.json(courses));
app.get('/api/users',(req,res)=>res.json(users));
const PORT=process.env.PORT||5000;
initDB().then(()=>{app.listen(PORT,()=>console.log(`Backend: http://localhost:${PORT} | DB: ${useDB?'MongoDB':'In-Memory'}`));});
