import { Link, useLocation } from 'react-router-dom';
export default function Navigation({ user, onLogout }){
  const loc = useLocation();
  const active = (p)=> loc.pathname===p ? {color:'#6366f1',fontWeight:700} : {};
  return (
    <nav style={{display:'flex',justifyContent:'space-between',padding:'16px 24px',background:'white',boxShadow:'0 1px 10px rgba(0,0,0,.05)',position:'sticky',top:0,zIndex:10}}>
      <Link to="/" style={{fontWeight:800,fontSize:20,textDecoration:'none',color:'#111'}}>skillhub</Link>
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        <Link to="/" style={{textDecoration:'none',color:'#333',...active('/')}}>Dashboard</Link>
        <Link to="/courses" style={{textDecoration:'none',color:'#333',...active('/courses')}}>Courses</Link>
        <Link to="/leaderboard" style={{textDecoration:'none',color:'#333'}}>Leaderboard</Link>
        {user ? <><span>{user.username} • {user.points} pts</span><button className="btn" onClick={onLogout}>Logout</button></> : <Link to="/auth" className="btn" style={{textDecoration:'none'}}>Login</Link>}
      <Link to="/admin" style={{textDecoration:"none",color:"#333"}}>Admin</Link></div></nav>
  )
}