import React from 'react'
import { useState } from 'react'
import { saveUpdates } from '../api/curd'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
const Profile = () => {

  const [name, setName]=useState('')
  const [state, setState]=useState('')
  const [res, setRes]=useState('');

  const {user} = useSelector(state=>state.auth);

  const handleSave= async()=>{
    const response= await saveUpdates(name, state, user.id);
    if(response){
      console.log(response);
      setRes('Update Successful');
    }
  }

  return (
    <div className='mx-auto w-150 border border-gray-500 rounded-md px-3 py-2 text-center m-10'>
      <h1 className='font-bold text-2xl'>Profile</h1>
      <div className='flex flex-col gap-2 mt-5'>
        <label htmlFor="">Update State</label>
        <input onChange={(e)=>setState(e.target.value)} className='border rounded-sm px-3 py-2' type="email" value={state} />
        <label htmlFor="">Update Name</label>
        <input onChange={(e)=>setName(e.target.value)} className='border rounded-sm px-3 py-2' type="text" value={name} />
        <button onClick={handleSave} className='m-auto bg-blue-500 rounded-sm text-white w-50 px-3 py-2 hover:bg-blue-600'>Save update</button>
        {res && <div className='text-xl'>
            {res}
            </div>} 
      </div>
      <Link className='block mt-2 w-35 m-auto bg-gray-300 px-3 py-2 text-white rounded-sm' to='/'>Back to Home</Link>
    </div>
  )
}

export default Profile
