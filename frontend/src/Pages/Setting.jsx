import React, { useEffect } from 'react'
import { useState } from 'react'
import { checkPassword, savePassword } from '../api/curd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Setting = () => {

  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [res, setRes] = useState('');
  const {user} = useSelector(state=>state.auth);
 
  useEffect(()=>{
    setRes('');
  }, [show])

  const handleCheck=async()=>{
    console.log('clicked')
    const response= await checkPassword(oldPassword, user.id);
    if(response) {
      console.log(response)
      setShow(true);
    }
    else {
      setRes('wrong password')
      setShow(false);
    };
  }  

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
        <label className='text-xl' htmlFor="">Old Password</label>
        <input onChange={(e)=>setOldPassword(e.target.value)} className='border rounded-sm mx-auto px-3 py-2 ' value={oldPassword} type="text" />
        <button onClick={handleCheck} className='bg-emerald-500 text-white px-3 py-2 w-40 mx-auto rounded-sm '>Change Password</button>
      </div>
      {res && 
       <div className='text-2xl'> 
        {res}
       </div>}
       {show && <div>
        <div className='flex flex-col gap-2'>
        <label className='text-xl' htmlFor="">New Password</label>
        <input onChange={(e)=>setPassword(e.target.value)} className='border rounded-sm mx-auto px-3 py-2 ' value={password} type="text" />
        <button onClick={handleSave} className='bg-emerald-500 text-white px-3 py-2 w-40 mx-auto rounded-sm '>Save Password</button>
      </div>
      {res && 
       <div className='text-2xl'> 
        {res}
       </div>}
       </div>
       }
       <Link className='block mt-2 w-35 m-auto bg-gray-300 px-3 py-2 text-white rounded-sm' to='/'>Back to Home</Link>
    </div>
  )
}

export default Setting
