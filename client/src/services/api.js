import axios from 'axios';

const api = axios.create({
    baseURL: 'https://issai-ai.vercel.app/api',
});

let cancelTokenSource;

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getExpenses = () => api.get('/expenses');
export const addExpense = (expense) => api.post('/expenses', expense);
export const batchImportExpenses = (expenses) => api.post('/expenses/batch', { expenses });
export const analyzeAllExpenses = () => api.post('/expenses/analyze-all');
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);
export const getStats = () => api.get('/expenses/stats');

export const syncUser = (userData) => api.post('/users/sync', userData);
export const getUserProfile = () => api.get('/users/profile');
export const exportCsv = async (token) => {
    // For file download with auth, we might need a blob fetch or signed URL. 
    // Simplest for now is passing token in query param if backend supported it, OR usage of fetch with blob.
    const response = await api.get('/expenses/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
};

export default api;
