import axios from 'axios';

// Funzione per ottenere il token dal localStorage
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt_token');
    }
    return null;
};

// Funzione per salvare il token
export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', token);
    }
};

// Funzione per rimuovere il token (logout)
export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
    }
};

// API per autenticazione (senza JWT)
export const userApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API per il catalogo (con JWT)
export const catalogApi = axios.create({
    baseURL: '/api/tobacconists',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API per i panel (con JWT)
export const panelApi = axios.create({
    baseURL: '/api/panels',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API per i brand (con JWT)
export const brandApi = axios.create({
    baseURL: '/api/brands',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor per aggiungere il JWT a tutte le richieste protette
const addAuthInterceptor = (apiInstance: ReturnType<typeof axios.create>) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Interceptor per gestire errori 401 (token scaduto/invalido)
    apiInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                removeToken();
                // Redirect al login se il token è scaduto
                if (typeof window !== 'undefined') {
                    //window.location.href = '/';
                }
            }
            return Promise.reject(error);
        }
    );
};

// Applica l'interceptor alle API protette
addAuthInterceptor(catalogApi);
addAuthInterceptor(panelApi);
addAuthInterceptor(brandApi);
