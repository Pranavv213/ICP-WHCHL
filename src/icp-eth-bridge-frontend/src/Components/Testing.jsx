import React from 'react'

function Testing() {

  return (
    <div>
       <br></br>
      
        <button onClick={()=>{
          localStorage.clear();
      
        }}>Clear Local Storage</button>
    </div>
  )
}

export default Testing
