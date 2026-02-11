
import { useState } from 'react'
import { saveUpdates } from '../api/curd'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'

const Profile = () => {

  const [name, setName]=useState('')
  const [state, setState]=useState('')
  const [res, setRes]=useState('');
  const [uploadRes, setUploadRes] = useState(null)
  const {user} = useSelector(state=>state.auth);

  const handleSave= async()=>{
    const response= await saveUpdates(name, state, user.id);
    if(response){
      console.log(response);
      setRes('Update Successful');
    }
  }

  const [file, setFile] = useState(null);

  const handleFileChange=(e)=>{
    setFile(e.target.files[0]);
    console.log(file);
  }

  const handleClick = async()=>{
    const formData = new FormData();
    formData.append('profile', file);
    formData.append("userId", user.id); 
    console.log(user.id);
    const response= await axios.post('http://localhost:3000/api/customer/upload-profile', formData, {headers: {'Content-Type': 'multipart/form-data'},});
    console.log(response.data)
    setUploadRes(response.data.message);
  }

  return (
    <div>
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
    <div className='p-5 mt-10 border mx-auto w-150'>
        <div className='flex flex-col gap-3 items-center justify-center text-md '>
          <label className='block text-2xl font-bold ' htmlFor="">Upload profile photo</label>
          <input className='border rounded-sm px-3 py-2 w-60' type='file' accept='image'  onChange={handleFileChange}/>
          <button onClick={handleClick} className='px-3 py-2 text-lg border rounded-md hover:bg-rose-500 bg-rose-400 text-white'>Upload photo</button>
          {uploadRes && <div className='text-xl'>
             {uploadRes}
            </div>}
        </div>
    </div>
   </div>
  )
}

export default Profile
