import axios from 'axios'

const getAllUsers = async() => {
  const response = await axios.get("http://localhost:3000/api/customer");
  return response.data;
}

// const saveEmail = async(email) =>{
//   const re
// }

export default getAllUsers