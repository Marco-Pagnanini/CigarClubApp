import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL_TOBACCONIST = `http://${API_BASE_URL}:8080/api`
export const API_BASE_URL_USER = `http://${API_BASE_URL}:8081/api`
export const API_BASE_URL_POST = `http://${API_BASE_URL}:8082/api`

// Chiave usata nel tuo AuthContext per salvare il token
const TOKEN_KEY = 'auth_token';


export const tobacconistApi = axios.create({
    baseURL: API_BASE_URL_TOBACCONIST + '/tobacconists',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const panelApi = axios.create({
    baseURL: API_BASE_URL_TOBACCONIST + '/panels',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const cigarApi = axios.create({
    baseURL: API_BASE_URL_TOBACCONIST + '/cigars',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const userApi = axios.create({
    baseURL: API_BASE_URL_USER + '/users',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const postsApi = axios.create({
    baseURL: API_BASE_URL_POST + '/posts',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});
export const brandApi = axios.create({
    baseURL: API_BASE_URL_TOBACCONIST + '/brands',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});
const addAuthInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        async (config) => {
            try {
                // Recupera il token salvato al login
                const token = await SecureStore.getItemAsync(TOKEN_KEY);

                // Se c'è un token, aggiungilo agli headers
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Errore nel recupero del token per la richiesta API:', error);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Tutte le chiamate con token jwt
addAuthInterceptor(tobacconistApi);
addAuthInterceptor(panelApi);
addAuthInterceptor(cigarApi);
addAuthInterceptor(userApi);
addAuthInterceptor(postsApi);
addAuthInterceptor(brandApi);
