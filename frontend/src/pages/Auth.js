import { useState } from 'react';
export default function Auth({ onLogin }){
  const [isLogin,setIsLogin]=useState(true);
  const [form,setForm]=useState({username:'',email:'',password:''});
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const submit = async (e)=>{
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try{
      const res = await fetch(API+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      if(data.token){ localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); onLogin(data.user); window.location='/' }
      else alert(data.error||'Error');
    }catch(err){ // fallback mock for demo without backend
      const mockUser = { _id:'mock1', username: form.username||form.email.split('@')[0], email:form.email, points:10, streak:1, enrolledCourses:[], badges:['Welcome'] };
      localStorage.setItem('user',JSON.stringify(mockUser)); onLogin(mockUser); window.location='/';
    }
  }
  return (
    <div className="fade-in" style={{maxWidth:400,margin:'60px auto'}}><div className="card">
      <h2>{isLogin?'Login':'Register'} to SkillHub</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
        {!isLogin && <input placeholder="Username" required value={form.username} onChange={e=>setForm({...form,username:e.target.value})} style={{padding:12,borderRadius:8,border:'1px solid #ddd'}}/>}
        <input placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{padding:12,borderRadius:8,border:'1px solid #ddd'}}/>
        <input placeholder="Password" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={{padding:12,borderRadius:8,border:'1px solid #ddd'}}/>
        <button className="btn" type="submit">{isLogin?'Login':'Create Account'}</button>
      </form>
      <p onClick={()=>setIsLogin(!isLogin)} style={{cursor:'pointer',color:'#6366f1',marginTop:12}}>{isLogin?'No account? Register':'Already have account? Login'}</p>
      <p style={{fontSize:12,color:'#888',marginTop:10}}>Backend na thakle mock login kaj korbe (demo mode)</p>
    </div></div>
  )
}