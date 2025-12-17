import React, { useState } from 'react';
import { addExpense, uploadExpenses } from '../services/api';

const ExpenseForm = ({ onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('manual');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addExpense(formData);
            setFormData({
                title: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
            }); // Reset form
            onExpenseAdded();
            alert('Expense added successfully!');
        } catch (error) {
            alert('Error adding expense');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        const data = new FormData();
        data.append('file', file);
        try {
            await uploadExpenses(data);
            setFile(null);
            onExpenseAdded();
            alert('CSV uploaded successfully!');
        } catch (error) {
            alert('Error uploading CSV');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex border-b mb-4">
                <button
                    className={`mr-4 pb-2 ${activeTab === 'manual' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('manual')}
                >
                    Manual Entry
                </button>
                <button
                    className={`pb-2 ${activeTab === 'csv' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('csv')}
                >
                    CSV Upload
                </button>
            </div>

            {activeTab === 'manual' ? (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border p-2 rounded w-full" />
                        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required className="border p-2 rounded w-full" />
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border p-2 rounded w-full" />
                        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full" />
                    </div>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Adding...' : 'Add Expense'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleFileUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 p-6 rounded text-center">
                        <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button type="submit" disabled={loading || !file} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">CSV format: Title, Amount, Date, Description</p>
                </form>
            )}
        </div>
    );
};

export default ExpenseForm;
