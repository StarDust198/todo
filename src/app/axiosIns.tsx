import axios from 'axios';

export const axiosIns = axios.create({
  baseURL: 'https://todo-9747f-default-rtdb.firebaseio.com/',
});
