import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const IP = process.env.EXPO_PUBLIC_API_IP;

export const CATALOG_URL = process.env.EXPO_PUBLIC_CATALOG_URL ?? `http://${IP}:8080/api`;
export const USER_URL    = process.env.EXPO_PUBLIC_USER_URL    ?? `http://${IP}:8081/api`;
export const POST_URL    = process.env.EXPO_PUBLIC_POST_URL    ?? `http://${IP}:8082/api`;

export const tobacconistApi = axios.create({
    baseURL: `${CATALOG_URL}/tobacconists`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const panelApi = axios.create({
    baseURL: `${CATALOG_URL}/panels`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const cigarApi = axios.create({
    baseURL: `${CATALOG_URL}/cigars`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const brandApi = axios.create({
    baseURL: `${CATALOG_URL}/brands`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const userApi = axios.create({
    baseURL: `${USER_URL}/users`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const postsApi = axios.create({
    baseURL: `${POST_URL}/posts`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'auth_token';

const addAuthInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        async (config) => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Errore nel recupero del token:', error);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};

addAuthInterceptor(tobacconistApi);
addAuthInterceptor(panelApi);
addAuthInterceptor(cigarApi);
addAuthInterceptor(brandApi);
addAuthInterceptor(userApi);
addAuthInterceptor(postsApi);
