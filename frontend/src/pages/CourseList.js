import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function CourseList(){
  const [courses,setCourses]=useState([]);
  const [q,setQ]=useState('');
  const [level,setLevel]=useState('All');
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  useEffect(()=>{
    fetch(API+'/api/courses').then(r=>r.json()).then(setCourses).catch(()=>{
      setCourses([
        { _id:'1', title:'Complete Web Development', description:'HTML, CSS, JS, React, Node.js', category:'Development', level:'Beginner', instructor:'Jhankar Mahbub', duration:40, rating:4.8, studentsEnrolled:1250 },
        { _id:'2', title:'Python for Beginners', description:'Python basic to advanced', category:'Programming', level:'Beginner', instructor:'Mhotasin Munna', duration:25, rating:4.9, studentsEnrolled:980 },
        { _id:'3', title:'UI/UX Design Masterclass', description:'Figma professional design', category:'Design', level:'Intermediate', instructor:'Fahim', duration:30, rating:4.7, studentsEnrolled:650 },
        { _id:'4', title:'Digital Marketing 2026', description:'SEO, Facebook Ads', category:'Marketing', level:'Beginner', instructor:'Nasir', duration:20, rating:4.6, studentsEnrolled:1100 },
        { _id:'5', title:'Data Science with Python', description:'Pandas, Numpy, ML', category:'Data Science', level:'Advanced', instructor:'Anisul', duration:50, rating:4.9, studentsEnrolled:430 },
        { _id:'6', title:'AI Fundamentals', description:'ChatGPT, Prompt Engineering', category:'AI', level:'Intermediate', instructor:'Sakib', duration:15, rating:4.8, studentsEnrolled:2000 },
      ])
    })
  },[]);
  const filtered = courses.filter(c=> (level==='All'||c.level===level) && c.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{padding:24,maxWidth:1100,margin:'0 auto'}} className="fade-in">
      <h1>Courses</h1>
      <div style={{display:'flex',gap:12,marginBottom:20}}>
        <input placeholder="Search courses..." value={q} onChange={e=>setQ(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid #ddd',flex:1}}/>
        <select value={level} onChange={e=>setLevel(e.target.value)} style={{padding:10,borderRadius:8}}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
        {filtered.map(c=>(
          <div key={c._id} className="card">
            <h3>{c.title}</h3><p style={{color:'#666'}}>{c.description}</p>
            <p style={{fontSize:13}}>{c.category} • {c.level} • ⭐ {c.rating} • {c.studentsEnrolled} students</p>
            <p style={{fontSize:13}}><b>{c.instructor}</b> • {c.duration} hours</p>
            <Link to={`/courses/${c._id}`} className="btn" style={{textDecoration:'none'}}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  )
}