import axios from 'axios';

export const userApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
