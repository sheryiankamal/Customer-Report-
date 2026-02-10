import React from 'react'
import { useState } from 'react'
import { savePassword } from '../api/curd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Setting = () => {

  const [password, setPassword] = useState('')
  const [res, setRes] = useState('');
  const {user} = useSelector(state=>state.auth);

  const handleSave=async()=>{
    const response= await savePassword(password, user.id);
    if(response) {
      console.log(response)
      setRes('Update Successfull');
    }
  }

  return (
    <div className='mx-auto w-150 border px-3 py-2 text-center mt-10'>
      <h1 className='text-xl font-semibold'>Setting</h1>
      <div className='flex flex-col gap-2'>
        <label className='text-xl' htmlFor="">Change Password</label>
        <input onChange={(e)=>setPassword(e.target.value)} className='border rounded-sm mx-auto px-3 py-2 ' value={password} type="text" />
        <button onClick={handleSave} className='bg-emerald-500 text-white px-3 py-2 w-40 mx-auto rounded-sm '>Save Password</button>
      </div>
      {res && 
       <div className='text-2xl'> 
        {res}
       </div>}
       <Link className='block mt-2 w-35 m-auto bg-gray-300 px-3 py-2 text-white rounded-sm' to='/'>Back to Home</Link>
    </div>
  )
}

export default Setting
