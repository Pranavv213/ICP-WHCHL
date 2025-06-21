import React from 'react'
import { useParams } from 'react-router-dom';

function ErrorPage() {

     const { error_message } = useParams();
  return (
    <div >
      
      <h1 style={{color:'white'}}>{error_message}</h1>
    </div>
  )
}

export default ErrorPage
