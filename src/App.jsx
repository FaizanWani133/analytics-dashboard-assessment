
import { useEffect } from 'react';
import './App.css'

function App() {


  useEffect(()=>{
    fetch( '../public/data.json' )
    .then( response => response.json() )
    .then( csvText => {
        
        console.log(csvText)
    }).catch((err)=>console.log(err))
  },[])

  

  return (
    <>
     
    </>
  )
}

export default App
