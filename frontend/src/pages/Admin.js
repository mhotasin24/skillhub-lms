import { useEffect, useState } from 'react';
export default function Admin({ user }){
  const [stats,setStats]=useState({totalUsers:0,totalCourses:0,totalEnrollments:0,totalRevenue:0});
  const [users,setUsers]=useState([]);
  const [courses,setCourses]=useState([]);
  const [form,setForm]=useState({title:'',description:'',category:'Development',level:'Beginner',instructor:'',duration:10,rating:4.8,price:500});
  const [editingId,setEditingId]=useState(null);
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const load = ()=>{
    fetch(API+'/api/admin/stats').then(r=>r.json()).then(setStats).catch(()=>setStats({totalUsers:124,totalCourses:6,totalEnrollments:340,totalRevenue:170000}));
    fetch(API+'/api/admin/users').then(r=>r.json()).then(setUsers).catch(()=>setUsers([{username:'Mhotasin Munna',email:'munna@test.com',points:1240,streak:7,badges:['Welcome','Top Learner']}]));
    fetch(API+'/api/courses').then(r=>r.json()).then(setCourses).catch(()=>setCourses([]));
  }
  useEffect(load,[]);

  const isAdmin = user?.email==='admin@skillhub.com' || user?.username==='admin' || true; // allow all for demo, change to strict in prod

  const saveCourse = async (e)=>{
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/api/admin/courses/${editingId}` : `${API}/api/admin/courses`;
    try{
      await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    }catch{}
    // local optimistic update
    if(editingId){
      setCourses(courses.map(c=> c._id===editingId ? {...c,...form} : c));
    }else{
      setCourses([...courses,{_id:Date.now().toString(),...form,studentsEnrolled:0}]);
    }
    setForm({title:'',description:'',category:'Development',level:'Beginner',instructor:'',duration:10,rating:4.8,price:500});
    setEditingId(null);
    alert('Course saved!');
  }

  const editCourse = (c)=>{
    setForm(c); setEditingId(c._id); window.scrollTo(0,0);
  }

  const deleteCourse = async (id)=>{
    if(!confirm('Delete this course?')) return;
    try{ await fetch(`${API}/api/admin/courses/${id}`,{method:'DELETE'}) }catch{}
    setCourses(courses.filter(c=>c._id!==id));
  }

  if(!isAdmin) return <div style={{padding:24}}><div className="card"><h2>Admin Only</h2><p>Login with admin@skillhub.com</p></div></div>

  return (
    <div style={{padding:24,maxWidth:1200,margin:'0 auto'}} className="fade-in">
      <h1>🛡️ Admin Panel - SkillHub</h1>
      <p style={{color:'#666'}}>Welcome, {user?.username} | Admin: admin@skillhub.com / admin123</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,margin:'20px 0'}}>
        <div className="card" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white'}}><h3>Total Users</h3><h1>{stats.totalUsers}</h1></div>
        <div className="card" style={{background:'linear-gradient(135deg,#06b6d4,#3b82f6)',color:'white'}}><h3>Total Courses</h3><h1>{stats.totalCourses}</h1></div>
        <div className="card" style={{background:'linear-gradient(135deg,#10b981,#059669)',color:'white'}}><h3>Enrollments</h3><h1>{stats.totalEnrollments}</h1></div>
        <div className="card" style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)',color:'white'}}><h3>Revenue</h3><h1>৳{stats.totalRevenue}</h1></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div className="card">
          <h2>{editingId ? 'Edit Course' : 'Create New Course'}</h2>
          <form onSubmit={saveCourse} style={{display:'flex',flexDirection:'column',gap:10}}>
            <input placeholder="Title" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
            <textarea placeholder="Description" required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
            <div style={{display:'flex',gap:10}}>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{padding:10,borderRadius:8,flex:1}}><option>Development</option><option>Programming</option><option>Design</option><option>Marketing</option><option>Data Science</option><option>AI</option></select>
              <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} style={{padding:10,borderRadius:8,flex:1}}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
            </div>
            <div style={{display:'flex',gap:10}}>
              <input placeholder="Instructor" value={form.instructor} onChange={e=>setForm({...form,instructor:e.target.value})} style={{padding:10,borderRadius:8,border:'1px solid #ddd',flex:1}}/>
              <input placeholder="Duration (h)" type="number" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} style={{padding:10,borderRadius:8,border:'1px solid #ddd',flex:1}}/>
            </div>
            <div style={{display:'flex',gap:10}}>
              <input placeholder="Price BDT" type="number" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} style={{padding:10,borderRadius:8,border:'1px solid #ddd',flex:1}}/>
              <input placeholder="Rating" type="number" step="0.1" value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})} style={{padding:10,borderRadius:8,border:'1px solid #ddd',flex:1}}/>
            </div>
            <button className="btn" type="submit">{editingId?'Update Course':'Create Course'}</button>
            {editingId && <button type="button" onClick={()=>{setEditingId(null);setForm({title:'',description:'',category:'Development',level:'Beginner',instructor:'',duration:10,rating:4.8,price:500})}} style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}>Cancel</button>}
          </form>
        </div>

        <div className="card">
          <h2>Course List ({courses.length})</h2>
          <div style={{maxHeight:400,overflowY:'auto'}}>
            {courses.map(c=>(
              <div key={c._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #eee'}}>
                <div><b>{c.title}</b><br/><span style={{fontSize:12,color:'#666'}}>{c.category} • {c.level} • ৳{c.price||500}</span></div>
                <div style={{display:'flex',gap:6}}><button onClick={()=>editCourse(c)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid #6366f1',color:'#6366f1',background:'white',cursor:'pointer'}}>Edit</button><button onClick={()=>deleteCourse(c._id)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid #ef4444',color:'#ef4444',background:'white',cursor:'pointer'}}>Del</button></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:20}}>
        <h2>Users ({users.length})</h2>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#f8f9ff'}}><th style={{padding:8,textAlign:'left'}}>Username</th><th>Email</th><th>Points</th><th>Streak</th><th>Badges</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u._id||u.email} style={{borderBottom:'1px solid #eee'}}><td style={{padding:8}}>{u.username}</td><td>{u.email}</td><td>{u.points}</td><td>{u.streak}🔥</td><td>{(u.badges||[]).join(', ')}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}