import { axios } from 'axios';

export const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true

});

export default Api;

