import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function Dashboard({user}){
  const [courses,setCourses]=useState([]);
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  useEffect(()=>{
    fetch(API+'/api/courses').then(r=>r.json()).then(setCourses).catch(()=>{
      setCourses([
        { _id:'1', title:'Complete Web Development', category:'Development', level:'Beginner', instructor:'Jhankar Mahbub', rating:4.8, studentsEnrolled:1250, duration:40 },
        { _id:'2', title:'Python for Beginners', category:'Programming', level:'Beginner', instructor:'Mhotasin Munna', rating:4.9, studentsEnrolled:980, duration:25 },
        { _id:'3', title:'UI/UX Design Masterclass', category:'Design', level:'Intermediate', instructor:'Fahim', rating:4.7, studentsEnrolled:650, duration:30 },
      ])
    })
  },[]);
  const enrolled = user?.enrolledCourses || [];
  return (
    <div className="fade-in" style={{padding:24,maxWidth:1100,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div className="card"><h3>🔥 Streak</h3><h1>{user?.streak||1} days</h1></div>
        <div className="card"><h3>⭐ Points</h3><h1>{user?.points||0}</h1></div>
        <div className="card"><h3>📚 Enrolled</h3><h1>{enrolled.length}</h1></div>
        <div className="card"><h3>🏅 Badges</h3><p>{(user?.badges||['Welcome']).join(', ')}</p></div>
      </div>
      <h2>Continue Learning</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
        {courses.map(c=>(
          <div key={c._id} className="card">
            <h4>{c.title}</h4><p style={{color:'#666',fontSize:14}}>{c.instructor} • {c.duration}h • {c.level}</p>
            <div style={{background:'#eee',height:6,borderRadius:4,margin:'10px 0'}}><div style={{width:`${Math.floor(Math.random()*80)+20}%`,background:'#6366f1',height:6,borderRadius:4}}></div></div>
            <Link to={`/courses/${c._id}`} className="btn" style={{textDecoration:'none',display:'inline-block'}}>View Course</Link>
          </div>
        ))}
      </div>
    </div>
  )
}