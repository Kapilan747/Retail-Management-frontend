import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const getProducts = () => API.get('/products');
export const addProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getCustomers = () => API.get('/customers');
export const addCustomer = (data) => API.post('/customers', data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);

export const getSales = () => API.get('/sales');
export const addSale = (data) => API.post('/sales', data);

export const getUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const addUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const loginUser = async (username, password) => {
  const res = await API.get(`/users?username=${username}&password=${password}`);
  const user = res.data[0];
  if (user && !user.id && user._id) user.id = user._id;
  return user;
};
export const updateUserActivity = (id, clear = false) => {
  const data = clear ? { lastActive: null } : { lastActive: new Date().toISOString() };
  return API.patch(`/users/${id}`, data);
};

export const getOrders = () => API.get('/orders');
export const addOrder = (data) => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`); 