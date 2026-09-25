require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors({origin:true, credentials:true}));
app.use(express.json());

let users=[{_id:'1',username:'admin',email:'admin@skillhub.com',password:bcrypt.hashSync('admin123',10),role:'admin',points:100,badges:['Admin']}];
let courses=[
{_id:'1',title:'React for Beginners',description:'Learn React from scratch',category:'Web Development',level:'Beginner',instructor:'Mhotasin Munna',price:0,rating:4.8,students:120,thumbnail:'https://via.placeholder.com/300x200?text=React'},
{_id:'2',title:'Node.js Masterclass',description:'Backend with Node.js & Express',category:'Backend',level:'Advanced',instructor:'Mhotasin Munna',price:2000,rating:4.9,students:80,thumbnail:'https://via.placeholder.com/300x200?text=NodeJS'},
{_id:'3',title:'Python for Beginners',description:'Complete Python from zero to hero with projects',category:'Programming',level:'Beginner',instructor:'Mhotasin Munna',price:1500,rating:4.9,students:0,thumbnail:'https://via.placeholder.com/300x200?text=Python'}
];

app.get('/',(req,res)=>res.json({status:'SkillHub API running', db:'memory', courses:courses.length, bKash:'01784549493 Personal'}));
app.post('/api/auth/register',async(req,res)=>{
 const {username,email,password}=req.body;
 if(users.find(u=>u.email===email)) return res.status(400).json({error:'Email exists'});
 const newUser={_id:Date.now().toString(),username,email,password:bcrypt.hashSync(password,10),role:'student',points:10,badges:['Welcome']};
 users.push(newUser);
 const token=jwt.sign({id:newUser._id},'skillhub_secret_2026',{expiresIn:'7d'});
 const {password:_,...safe}=newUser;
 res.json({token,user:safe});
});
app.post('/api/auth/login',async(req,res)=>{
 const {email,password}=req.body;
 const user=users.find(u=>u.email===email);
 if(!user) return res.status(404).json({error:'User not found'});
 if(!bcrypt.compareSync(password,user.password)) return res.status(401).json({error:'Wrong password'});
 const token=jwt.sign({id:user._id},'skillhub_secret_2026',{expiresIn:'7d'});
 const {password:_,...safe}=user;
 res.json({token,user:safe});
});
app.get('/api/courses',(req,res)=>res.json(courses));
app.get('/api/users',(req,res)=>res.json(users.map(({password,...u})=>u)));
app.post('/api/payment/verify',(req,res)=>{
 const {trxId,senderNumber}=req.body;
 if(!trxId) return res.status(400).json({error:'TrxID required'});
 res.json({success:true,message:`bKash 01784549493 verified TrxID: ${trxId}`});
});
app.listen(5000,()=>console.log('✅ Backend: http://localhost:5000 | 3 courses | bKash: 01784549493'));
