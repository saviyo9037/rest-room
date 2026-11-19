"use client";
import {useEffect,useState} from "react";

export default function Admin(){
  const [rows,setRows]=useState<any[]>([]);
  const [error,setError]=useState("");
  useEffect(()=>{
    fetch("/api/resort")
      .then(r=>r.json())
      .then(d=>{if(d.error)setError(d.error);else setRows(d.bookings||[])})
      .catch(e=>setError(e.message));
  },[]);
  return (
    <main style={{minHeight:"100vh",background:"#101510",color:"white",padding:"clamp(16px, 4vw, 40px)",width:"100%",maxWidth:"100%",overflowX:"hidden"}}>
      <a href="/" style={{color:"white",display:"inline-block",padding:"8px 0"}}>← Resort websites</a>
      <h1 style={{fontSize:"clamp(26px, 6vw, 36px)",lineHeight:1.15,marginTop:24,overflowWrap:"anywhere"}}>Resort admin · Demo</h1>
      <p style={{color:"#b5bdb5",marginTop:8,lineHeight:1.7,maxWidth:720,fontSize:14}}>Shared reservation calendar across all three resort websites. Guest details and management actions require an administrator account.</p>
      {error&&<p role="alert" style={{color:"#ffb4a8",marginTop:20,overflowWrap:"anywhere"}}>{error}</p>}
      <div className="table-wrap" style={{width:"100%",maxWidth:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch",marginTop:26,border:"1px solid #344036",borderRadius:10}}>
        <table style={{width:"100%",minWidth:520,textAlign:"left",borderCollapse:"collapse"}}>
          <thead><tr><th style={{padding:12}}>Room</th><th style={{padding:12}}>Check-in</th><th style={{padding:12}}>Check-out</th></tr></thead>
          <tbody>{rows.map((b:any,i)=><tr key={i}><td style={{padding:12,borderTop:"1px solid #444"}}>{b.room_id}</td><td style={{padding:12,borderTop:"1px solid #444",whiteSpace:"nowrap"}}>{b.check_in}</td><td style={{padding:12,borderTop:"1px solid #444",whiteSpace:"nowrap"}}>{b.check_out}</td></tr>)}</tbody>
        </table>
      </div>
      {!rows.length&&!error&&<p style={{marginTop:20,color:"#b5bdb5"}}>No active reservations.</p>}
      <p style={{marginTop:14,color:"#879287",fontSize:12}}>On small screens, swipe the reservation table horizontally to view every column.</p>
    </main>
  );
}