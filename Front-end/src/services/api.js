import axios from 'axios';

//api predict
export const predictClient = axios.create({
  baseURL: 'https://iii-mood-carrier-prime.trycloudflare.com', // เปลี่ยนตาม URL จริง
});

//api register
export const registerClient = axios.create({
  baseURL: 'http://localhost/api', 
});

//// api login
export const loginClient = axios.create({
  baseURL: 'http://localhost/api',
});