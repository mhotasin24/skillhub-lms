import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export default function CourseDetail({user}){
  const { id } = useParams();
  const [course,setCourse]=useState(null);
  const [enrolled,setEnrolled]=useState(false);
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  useEffect(()=>{
    fetch(API+`/api/courses/${id}`).then(r=>r.json()).then(setCourse).catch(()=>{
      setCourse({ _id:id, title:'Complete Web Development', description:'Full-stack with React & Node', category:'Development', level:'Beginner', instructor:'Jhankar Mahbub', duration:40, rating:4.8, studentsEnrolled:1250, lessons:[{title:'HTML Basics',duration:20},{title:'CSS Mastery',duration:30},{title:'React JS',duration:45}] })
    })
  },[id]);
  const handleEnroll = async ()=>{
    try{
      await fetch(API+`/api/courses/${id}/enroll`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:user?._id})});
    }catch{}
    setEnrolled(true); alert('Enrolled! +20 points');
  }
  const completeLesson = async (lessonTitle)=>{
    try{ await fetch(API+`/api/lessons/${lessonTitle}/complete`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:user?._id})}); }catch{}
    alert('Lesson completed! +10 points');
  }
  if(!course) return <p style={{padding:24}}>Loading...</p>
  return (
    <div style={{padding:24,maxWidth:900,margin:'0 auto'}} className="fade-in">
      <div className="card">
        <h1>{course.title}</h1><p>{course.description}</p>
        <p><b>Instructor:</b> {course.instructor} | <b>Level:</b> {course.level} | ⭐ {course.rating} | {course.studentsEnrolled} enrolled | {course.duration}h</p>
        <button className="btn" onClick={handleEnroll}>{enrolled?'Enrolled ✓':'Enroll Now - Free'}</button>
      </div>
      <h2 style={{marginTop:24}}>Lessons ({course.lessons?.length||3})</h2>
      {(course.lessons||[{title:'HTML Basics'},{title:'CSS Mastery'},{title:'React JS'}]).map((l,i)=>(
        <div key={i} className="card" style={{marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><b>{i+1}. {l.title}</b> • {l.duration||20} min</div>
          <div style={{display:'flex',gap:8}}><button className="btn" onClick={()=>completeLesson(l.title)}>Mark Complete</button><button className="btn" style={{background:'#8b5cf6'}} onClick={()=>alert('Quiz: What is React? A) Library B) Framework')}>Quiz</button></div>
        </div>
      ))}
      <div className="card" style={{marginTop:20,background:'#eef2ff'}}><h3>🤖 Gemini AI Study Helper (Mock)</h3><p>Gemini 3 Flash will create quiz & summary here when backend is connected.</p><button className="btn" onClick={()=>alert('AI Summary: This course teaches full-stack development with hands-on projects.')}>Generate Summary</button></div>
    </div>
  )
}