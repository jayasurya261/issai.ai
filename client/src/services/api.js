import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
});

export const getExpenses = () => api.get('/expenses');
export const addExpense = (expense) => api.post('/expenses', expense);
export const uploadExpenses = (formData) => api.post('/expenses/upload', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const analyzeAllExpenses = () => api.post('/expenses/analyze-all');
export const getStats = () => api.get('/expenses/stats');
export const exportCsv = () => {
    window.open('http://localhost:5000/api/expenses/export/csv', '_blank');
};

export default api;
