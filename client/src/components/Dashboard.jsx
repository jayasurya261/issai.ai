import React, { useEffect, useState } from 'react';
import { getExpenses, getStats, exportCsv, analyzeAllExpenses, logout, deleteExpense } from '../services/api';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
    const { user, loading } = useUser();
    const [expenses, setExpenses] = useState([]);
    const [stats, setStats] = useState([]);

    const [editingExpense, setEditingExpense] = useState(null);

    const fetchData = async () => {
        try {
            const expensesRes = await getExpenses();
            const statsRes = await getStats();
            setExpenses(expensesRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // Prepare Chart Data
    const chartData = {
        labels: stats.map(s => s._id),
        datasets: [
            {
                label: 'Expenses by Category',
                data: stats.map(s => s.totalAmount),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#8AC926',
                    '#1982C4',
                ],
                borderWidth: 1,
            },
        ],
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense(id);
                fetchData(); // Refresh list
            } catch (error) {
                console.error("Error deleting expense", error);
                alert("Failed to delete expense");
            }
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        // Ideally scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAnalyze = async () => {
        try {
            await analyzeAllExpenses();
            alert("Analysis started. Expenses are being re-categorized.");
            fetchData();
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to start analysis");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/" replace />;
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">AI Expense Tracker</h1>
                <div className="flex gap-4">
                    <button onClick={handleAnalyze} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Re-Analyze Data
                    </button>
                    <button onClick={exportCsv} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                        Export CSV
                    </button>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                    <ExpenseForm
                        onExpenseAdded={() => {
                            fetchData();
                            setEditingExpense(null);
                        }}
                        editingExpense={editingExpense}
                        onCancelEdit={() => setEditingExpense(null)}
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-center">Category Breakdown</h3>
                    {stats.length > 0 ? (
                        <div className="h-64 flex justify-center">
                            <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No data available for charts.</p>
                    )}
                </div>
            </div>

            <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default Dashboard;
