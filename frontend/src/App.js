import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Admin from './pages/Admin';
import Payment from './pages/Payment';
function Leaderboard(){return <div style={{padding:24}}><div className='card'><h2>Leaderboard</h2></div></div>}
export default function App(){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('user'))}catch{return null}});const onLogout=()=>{localStorage.clear();setUser(null);window.location='/auth'};return (<BrowserRouter><Navigation user={user} onLogout={onLogout}/><Routes><Route path='/' element={user?<Dashboard user={user}/>:<Auth onLogin={setUser}/>}/><Route path='/auth' element={<Auth onLogin={setUser}/>}/><Route path='/courses' element={<CourseList/>}/><Route path='/courses/:id' element={<CourseDetail user={user}/>}/><Route path='/admin' element={<Admin user={user}/>}/><Route path='/pay/:id' element={<Payment user={user}/>}/><Route path='/leaderboard' element={<Leaderboard/>}/></Routes></BrowserRouter>)}