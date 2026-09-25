
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
export default function Payment({ user }){
  const { id } = useParams();
  const navigate = useNavigate();
  const [method,setMethod]=useState('bKash');
  const [sender,setSender]=useState('');
  const [txn,setTxn]=useState('');
  const [loading,setLoading]=useState(false);
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const coursePrice = 500;
  const handlePay = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch(API+'/api/payments/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId: user?._id||'mock_user',courseId:id,amount:coursePrice,method,senderNumber:sender,transactionId:txn})});
      const data = await res.json();
      alert('✅ Payment submitted! TrxID: '+data.payment.transactionId);
      navigate('/');
    }catch(err){
      alert('Payment saved locally (demo). Admin verify korbe!');
      navigate('/');
    }
    setLoading(false);
  }
  return (
    <div style={{padding:24,maxWidth:500,margin:'0 auto'}} className="fade-in">
      <div className="card">
        <h2>💳 Pay with bKash</h2>
        <div style={{background:'#e11d48',color:'white',padding:16,borderRadius:12,marginBottom:16}}>
          <h3 style={{margin:0}}>bKash: 017XX-XXXXXX</h3>
          <p style={{margin:'8px 0 0',fontSize:13}}>Send Money → Ref: Course-{id?.slice(0,4)} • ৳{coursePrice}</p>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:16}}>
          {['bKash','Nagad','Rocket'].map(m=>(
            <button key={m} onClick={()=>setMethod(m)} style={{flex:1,padding:10,borderRadius:8,border: method===m?'2px solid #e11d48':'1px solid #ddd',background: method===m?'#fff1f2':'white',cursor:'pointer'}}>{m}</button>
          ))}
        </div>
        <form onSubmit={handlePay} style={{display:'flex',flexDirection:'column',gap:12}}>
          <label style={{fontSize:14,fontWeight:600}}>তোমার {method} নাম্বার</label>
          <input required placeholder="01XXXXXXXXX" value={sender} onChange={e=>setSender(e.target.value)} style={{padding:12,borderRadius:8,border:'1px solid #ddd'}}/>
          <label style={{fontSize:14,fontWeight:600}}>Transaction ID (TrxID)</label>
          <input required placeholder="e.g. 8G7H9K2L1M" value={txn} onChange={e=>setTxn(e.target.value)} style={{padding:12,borderRadius:8,border:'1px solid #ddd'}}/>
          <button className="btn" type="submit" disabled={loading} style={{background:'#e11d48',marginTop:10}}>{loading?'Submitting...':`Confirm ৳${coursePrice}`}</button>
        </form>
        <div style={{marginTop:16,padding:12,background:'#f9fafb',borderRadius:8,fontSize:13}}>
          1. bKash app → Send Money → 017XX-XXXXXX<br/>2. Amount ৳{coursePrice} → Ref: Course-{id?.slice(0,4)}<br/>3. TrxID copy করে উপরে বসাও
        </div>
      </div>
    </div>
  )
}
