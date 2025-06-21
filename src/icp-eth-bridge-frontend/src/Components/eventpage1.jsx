import React from 'react'

function eventpage1() {
  return (
    <div>
       <img style={{width:'20em'}} src={events.length!=0 && events[0].Image}></img>
    <h1 style={{color:'white'}}> {events.length!=0 && events[0].Name}</h1>
  
  
  
 
    <br></br>
    {events.length!=0 && <div> <div class="alignIcons"><l style={{color:'#1876d1'}}><CalendarTodayIcon/> </l><l style={{color:'#1876d1'}}>Start: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && events[0].StartDateTime.slice(0,10)}</l>&nbsp;&nbsp;&nbsp;&nbsp; <l style={{color:'#1876d1'}}><AccessTimeIcon/> </l><l style={{color:'#1876d1'}}>Time: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && parseInt(events[0].StartDateTime.slice(11,13))>12 ? <l>{parseInt(events[0].StartDateTime.slice(11,13))-12}:{events[0].StartDateTime.slice(14)}&nbsp; PM</l>:<l>{parseInt(events[0].StartDateTime.slice(12,13))}:{events[0].StartDateTime.slice(14)}&nbsp; AM </l> }</l></div>
  
    
  <br></br> 
  <div class="alignIcons"><l style={{color:'#1876d1'}}><CalendarTodayIcon/> </l><l style={{color:'#1876d1'}}>End: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && events[0].EndDateTime.slice(0,10)}</l> &nbsp;&nbsp;&nbsp;&nbsp; <l style={{color:'#1876d1'}}><AccessTimeIcon/>  </l><l style={{color:'#1876d1'}}>Time: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && parseInt(events[0].EndDateTime.slice(11,13))>12 ? <l>{parseInt(events[0].EndDateTime.slice(11,13))-12}:{events[0].EndDateTime.slice(14)}&nbsp; PM</l>:<l>{parseInt(events[0].EndDateTime.slice(12,13))}:{events[0].EndDateTime.slice(14)}&nbsp; AM </l> }</l> </div>
  <br></br>
 
  <div class="alignIcons"><l style={{color:'#1876d1'}}><LocationPinIcon/> </l><l style={{color:'#1876d1'}}>Location: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && events[0].Address.slice(events[0].Address.lastIndexOf(",") + 1)} </l><l onClick={()=>{
    window.location.href=`https://www.google.com/maps?q=${events[0].Address}`
  }}style={{color:'white'}}>(View in Google Maps)</l><img src={mapImage} style={{width:'2em'}} onClick={()=>{
    window.location.href=`https://www.google.com/maps?q=${events[0].Address}`
  }}></img></div></div>
    
    
    }
   <br></br>
   <br></br>
    <l style={{color:'#1876d1', fontSize:'24px'}}>About the event</l>
    <br></br>
    <center>
    {events.length!=0 && <p style={{color:'white',maxWidth:'500px'}}>{events[0].Description}</p>}
    </center>
    <br></br>  <br></br>
    <hr></hr>

    <br></br><br></br>
    <br></br>
    <form onSubmit={handleSubmit}>
      {events.length!=0 && events[0].Questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '15px',color:'white' }}>
          <label style={{color:'#1876d1'}}>{question}</label>
          <br />
         
          <input  class="form__field"
            type="text" 
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            style={{maxWidth:'350px'}}
            
          />
        </div>
      ))}
       <br></br>
     
       <br></br>
      <button class="btn4" type="submit">Register</button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
     
     

    </form>
    </div>
  )
}

export default eventpage1



   