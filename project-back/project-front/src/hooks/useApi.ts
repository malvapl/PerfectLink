import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_HOST;

const getHeaders = (auth: boolean): Headers => {
   const headers = new Headers();
   headers.append('Content-Type', 'application/json');
   headers.append('Accept', 'application/json');
   if (auth) {
      const token = JSON.parse(localStorage.getItem('token') || '""');
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
      get: (endpoint: string, auth: boolean = true) =>
      fetch(BASE_URL + endpoint, {
         method: 'GET',
         headers: getHeaders(auth),
         redirect: 'manual',
      }).then(handleResponse),

      post: (endpoint: string, body: unknown, auth: boolean = true) =>
         fetch(BASE_URL + endpoint, {
            method: 'POST',
            headers: getHeaders(auth),
            body: JSON.stringify(body),
            redirect: 'follow',
         }).then(handleResponse),

      put: (endpoint: string, body: unknown, auth: boolean = true) =>
         fetch(BASE_URL + endpoint, {
            method: 'PUT',
            headers: getHeaders(auth),
            body: JSON.stringify(body),
            redirect: 'follow',
         }).then(handleResponse),

      patch: (endpoint: string, body: unknown, auth: boolean = true) =>
         fetch(BASE_URL + endpoint, {
            method: 'PATCH',
            headers: getHeaders(auth),
            body: JSON.stringify(body),
            redirect: 'follow',
         }).then(handleResponse),

      delete: (endpoint: string, auth: boolean = true) =>
         fetch(BASE_URL + endpoint, {
            method: 'DELETE',
            headers: getHeaders(auth),
            redirect: 'follow',
         }).then(handleResponse)
      }
};