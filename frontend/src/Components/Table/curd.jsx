import axios from 'axios'

const getAllUsers = async() => {
  const response = await axios.get("http://localhost:3000/users");
  return response.data;
}

export default getAllUsers