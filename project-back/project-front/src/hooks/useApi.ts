import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_HOST;

const getHeaders = (): Headers => {
   const token = JSON.parse(localStorage.getItem('token') || '""');
   const headers = new Headers();
   headers.append('Content-Type', 'application/json');
   headers.append('Accept', 'application/json');
   if (token) {
      headers.append('Authorization', `Bearer ${token}`);
   }
   return headers;
};

export const useApi = () => {
   const navigate = useNavigate();

   const handleResponse = async (response: Response) => {
      if (response.status === 401 || response.type === 'opaqueredirect') {
         navigate('/login');
         return;
      }
      return response.json();
   };

   return {
      get: (endpoint: string) =>
         api.get(endpoint).then(handleResponse),
      post: (endpoint: string, body: unknown) =>
         api.post(endpoint, body).then(handleResponse),
      put: (endpoint: string, body: unknown) =>
         api.put(endpoint, body).then(handleResponse),
      patch: (endpoint: string, body: unknown) =>
         api.patch(endpoint, body).then(handleResponse),
      delete: (endpoint: string) =>
         api.delete(endpoint).then(handleResponse),
   };
};

const api = {
   get: (endpoint: string) =>
      fetch(BASE_URL + endpoint, {
         method: 'GET',
         headers: getHeaders(),
         redirect: 'manual',
      }),

   post: (endpoint: string, body: unknown) =>
      fetch(BASE_URL + endpoint, {
         method: 'POST',
         headers: getHeaders(),
         body: JSON.stringify(body),
         redirect: 'follow',
      }),

   put: (endpoint: string, body: unknown) =>
      fetch(BASE_URL + endpoint, {
         method: 'PUT',
         headers: getHeaders(),
         body: JSON.stringify(body),
         redirect: 'follow',
      }),

   patch: (endpoint: string, body: unknown) =>
      fetch(BASE_URL + endpoint, {
         method: 'PATCH',
         headers: getHeaders(),
         body: JSON.stringify(body),
         redirect: 'follow',
      }),

   delete: (endpoint: string) =>
      fetch(BASE_URL + endpoint, {
         method: 'DELETE',
         headers: getHeaders(),
         redirect: 'follow',
      }),
};