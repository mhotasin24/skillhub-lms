require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let useDB = false;
let mongoose, User, Course;
try {
  mongoose = require('mongoose');
} catch(e){ console.log('Mongoose not found, using memory'); }

async function initDB(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';
  if(!mongoose){ return false; }
  try{
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected:', uri);
    // Models
    const userSchema = new mongoose.Schema({
      username: String, email: { type:String, unique:true }, password:String,
      points:{type:Number, default:10}, role:{type:String, default:'student'},
      enrolledCourses: [String], badges:[String], createdAt:{type:Date, default:Date.now}
    });
    User = mongoose.model('User', userSchema);
    const courseSchema = new mongoose.Schema({
      title:String, description:String, category:String,
      level:{type:String, default:'Beginner'}, instructor:String,
      price:Number, rating:Number, studentsEnrolled:{type:Number, default:0},
      createdAt:{type:Date, default:Date.now}
    });
    Course = mongoose.model('Course', courseSchema);
    useDB = true;
    return true;
  }catch(err){
    console.log('MongoDB not available, using in-memory storage:', err.message);
    useDB = false;
    return false;
  }
}

// In-memory fallback
let users = [{ _id:'1', username:'admin', email:'admin@skillhub.com', password: bcrypt.hashSync('admin123',10), role:'admin', points:100, badges:['Admin'] }];
let courses = [
  {_id:'1', title:'React for Beginners', description:'Learn React from scratch', category:'Web Dev', level:'Beginner', instructor:'Mhotasin', price:0, rating:4.8, studentsEnrolled:120},
  {_id:'2', title:'Node.js Mastery', description:'Backend with Node', category:'Backend', level:'Intermediate', instructor:'Mhotasin', price:500, rating:4.9, studentsEnrolled:80}
];

app.get('/', (req,res)=> res.json({ status:'SkillHub API running', db: useDB?'mongodb':'memory', time:new Date() }));
app.get('/api/health', (req,res)=> res.json({ ok:true, db: useDB?'mongodb':'memory' }));

app.post('/api/auth/register', async (req,res)=>{
  try{
    const { username, email, password } = req.body;
    if(useDB){
      const hashed = await bcrypt.hash(password,10);
      const user = await User.create({ username, email, password:hashed });
      const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET||'secret', {expiresIn:'7d'});
      return res.json({ token, user });
    } else {
      if(users.find(u=>u.email===email)) return res.status(400).json({error:'Email exists'});
      const newUser = { _id: Date.now().toString(), username, email, password: bcrypt.hashSync(password,10), role:'student', points:10, badges:['Welcome'] };
      users.push(newUser);
      const token = jwt.sign({ id:newUser._id }, 'secret', {expiresIn:'7d'});
      return res.json({ token, user:newUser });
    }
  }catch(e){ res.status(400).json({error:e.message}); }
});

app.post('/api/auth/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    if(useDB){
      const user = await User.findOne({ email });
      if(!user) return res.status(404).json({error:'User not found'});
      const ok = await bcrypt.compare(password, user.password);
      if(!ok) return res.status(401).json({error:'Wrong password'});
      const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET||'secret', {expiresIn:'7d'});
      return res.json({ token, user });
    } else {
      const user = users.find(u=>u.email===email);
      if(!user) return res.status(404).json({error:'User not found'});
      const ok = bcrypt.compareSync(password, user.password);
      if(!ok) return res.status(401).json({error:'Wrong password'});
      const token = jwt.sign({ id:user._id }, 'secret', {expiresIn:'7d'});
      return res.json({ token, user });
    }
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/courses', async (req,res)=>{
  if(useDB){ const data = await Course.find(); return res.json(data); }
  res.json(courses);
});

app.get('/api/courses/:id', async (req,res)=>{
  if(useDB){ const c = await Course.findById(req.params.id); return res.json(c); }
  res.json(courses.find(c=>c._id===req.params.id));
});

app.post('/api/courses', async (req,res)=>{
  if(useDB){ const c = await Course.create(req.body); return res.json(c); }
  const newCourse = { _id: Date.now().toString(), ...req.body };
  courses.push(newCourse);
  res.json(newCourse);
});

app.get('/api/users', async (req,res)=>{
  if(useDB){ return res.json(await User.find()); }
  res.json(users);
});

const PORT = process.env.PORT || 5000;
initDB().then(()=>{
  app.listen(PORT, ()=> console.log(`Backend: http://localhost:${PORT} | DB: ${useDB?'MongoDB':'In-Memory'}`));
});
