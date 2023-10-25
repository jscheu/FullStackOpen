import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const apiUrl = `${apiBaseUrl}/api/users`;

const getAll = async () => {
  const response = await axios.get(apiUrl);
  return response.data;
};

export default { getAll };
