import axios from 'axios';

export const API_BASE_URL = 'http://192.168.188.59:8080/api'

export const tobacconistApi = axios.create({
    baseURL: API_BASE_URL+'/tobacconists',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const panelApi = axios.create({
    baseURL: API_BASE_URL+'/panels',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const cigarApi = axios.create({
    baseURL: API_BASE_URL+'/cigars',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
