import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
export const deleteExpensesBatch = (ids) => api.post('/expenses/batch-delete', { ids });
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);
export const getStats = () => api.get('/expenses/stats');

export const syncUser = (userData) => api.post('/users/sync', userData);
export const getUserProfile = () => api.get('/users/profile');
export const getAIChatResponse = (message) => api.post('/ai/chat', { message });
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

export const exportPdf = async () => {
    const response = await api.get('/expenses/export/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.pdf');
    document.body.appendChild(link);
    link.click();
};

// Budget API
export const getBudgets = () => api.get('/budgets');
export const setBudget = (category, limit) => api.post('/budgets', { category, limit });
export const deleteBudget = (category) => api.delete(`/budgets/${category}`);

export default api;
