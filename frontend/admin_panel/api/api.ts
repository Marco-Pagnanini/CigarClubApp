import axios from 'axios';

export const userApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const catalogApi = axios.create({
    baseURL: '/api/tobacconists',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const panelApi = axios.create({
    baseURL: '/api/panels',
    headers: {
        'Content-Type': 'application/json',
    },
});
