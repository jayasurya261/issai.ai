import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { addExpense, batchImportExpenses, updateExpense } from '../services/api';

const ExpenseForm = ({ onExpenseAdded, editingExpense, onCancelEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('manual');

    useEffect(() => {
        if (editingExpense) {
            setFormData({
                title: editingExpense.title,
                amount: editingExpense.amount,
                date: new Date(editingExpense.date).toISOString().split('T')[0],
                description: editingExpense.description || '',
                category: editingExpense.category || ''
            });
            setActiveTab('manual');
        } else {
            setFormData({
                title: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                category: ''
            });
        }
    }, [editingExpense]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingExpense) {
                await updateExpense(editingExpense._id, formData);
                alert('Expense updated successfully!');
            } else {
                await addExpense(formData);
                alert('Expense added successfully!');
            }

            setFormData({
                title: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                category: ''
            }); // Reset form
            onExpenseAdded();
        } catch (error) {
            alert('Error saving expense');
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

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const expenses = results.data.map(row => {
                    // Normalize keys assuming some variations or exact match
                    const title = row.Title || row.title;
                    const amount = row.Amount || row.amount;
                    const date = row.Date || row.date || new Date();
                    const description = row.Description || row.description || '';

                    if (title && amount) {
                        return { title, amount, date, description };
                    }
                    return null;
                }).filter(e => e !== null);

                try {
                    await batchImportExpenses(expenses);
                    setFile(null);
                    onExpenseAdded();
                    alert(`Successfully imported ${expenses.length} expenses from CSV!`);
                } catch (error) {
                    alert('Error uploading expenses');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            },
            error: (error) => {
                console.error("CSV Parse Error", error);
                alert("Failed to parse CSV file");
                setLoading(false);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex border-b mb-4">
                <button
                    className={`mr-4 pb-2 ${activeTab === 'manual' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                    onClick={() => { setActiveTab('manual'); onCancelEdit(); }}
                >
                    {editingExpense ? 'Edit Expense' : 'Manual Entry'}
                </button>
                {!editingExpense && (
                    <button
                        className={`pb-2 ${activeTab === 'csv' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('csv')}
                    >
                        CSV Upload
                    </button>
                )}
            </div>

            {activeTab === 'manual' ? (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border p-2 rounded w-full" />
                        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required className="border p-2 rounded w-full" />
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border p-2 rounded w-full" />
                        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full" />
                        {editingExpense && (
                            <input type="text" name="category" placeholder="Category (Optional Override)" value={formData.category} onChange={handleChange} className="border p-2 rounded w-full" />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Add Expense')}
                        </button>
                        {editingExpense && (
                            <button type="button" onClick={onCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Cancel
                            </button>
                        )}
                    </div>
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
