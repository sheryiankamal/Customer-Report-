import axios from 'axios'

const getAllUsers = async() => {
  const response = await axios.get("http://localhost:3000/api/customer");
  console.log(response);
  return response.data;
}

export const saveUpdate = async(customer, id) =>{
  console.log(customer);
  const response = await axios.put('http://localhost:3000/api/customer/savecustomer', {customer, id})
  return response.data;
}

export const Login = async(email, password)=>{
  //console.log(email, password);
  try{
    const response = await axios.post('http://localhost:3000/api/customer/login', {email, password}, { withCredentials: true });
    console.log(response);
    return response.data;
  }catch(e){
    console.log(e);
    return false;
  }
}

export const checkLogin= async()=>{
  try{
    const response = await axios.get('http://localhost:3000/api/customer/login', {withCredentials: true});
    console.log(response)
     return response.data;
  }catch(e){
    console.log(e);
  }
}

export const Logout = async()=>{
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
  window.location.href = 'http://localhost:5173';
}

export const saveUpdates= async(name, state, id)=>{
  const response = await axios.put('http://localhost:3000/api/customer/saveUpdates', {name, state, id});
  return response.data.success;
}

export const savePassword= async(password, id)=>{
  const response= await axios.put('http://localhost:3000/api/customer/savePassword', {password, id});
  return response.data.success;
}

export const getNotications= async(user_id)=>{
  const response = await axios.get(`http://localhost:3000/api/customer/notifications/${user_id}`);
  return response.data;
}

export default getAllUsers