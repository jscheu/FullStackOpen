import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const apiUrl = `${apiBaseUrl}/api/blogs`;

const getAll = async () => {
  const response = await axios.get(apiUrl);
  return response.data;
};

const create = async ({ token, content }) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(apiUrl, content, {
    headers: headers,
  });
  return response;
};

const like = async ({ token, id }) => {
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.put(`${apiUrl}/${id}`, null, {
    headers: headers,
    params: { action: 'incrementLike' },
  });
  return response;
};

const comment = async ({ token, id, content }) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const url = `${apiUrl}/${id}/comments`;

  const response = await axios.post(url, { content }, { headers });

  return response;
};

const remove = async ({ token, id }) => {
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.delete(`${apiUrl}/${id}`, { headers: headers });
  return response;
};

export default {
  getAll,
  create,
  like,
  comment,
  remove,
};
