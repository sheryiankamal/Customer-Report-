import axios from 'axios'

const getAllUsers = async() => {
  const response = await axios.get("http://localhost:3000/api/customer");
  return response.data;
}

export const saveUpdate = async(customer) =>{
  console.log(customer);
  const response = await axios.put('http://localhost:3000/api/customer/savecustomer', customer)
  return response.data;
}

export default getAllUsers