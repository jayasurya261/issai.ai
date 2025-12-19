import React, { useState, useEffect } from 'react';
import { getBudgets, setBudget } from '../services/api';

const BudgetSection = ({ stats }) => {
    const [budgets, setBudgets] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newLimit, setNewLimit] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Food', 'Travel', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'];

    const fetchBudgets = async () => {
        try {
            const res = await getBudgets();
            setBudgets(res.data);
        } catch (error) {
            console.error("Error fetching budgets", error);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSetBudget = async (e) => {
        e.preventDefault();
        if (!newCategory || !newLimit) return;

        setLoading(true);
        try {
            await setBudget(newCategory, parseFloat(newLimit));
            fetchBudgets();
            setNewCategory('');
            setNewLimit('');
        } catch (error) {
            console.error("Error setting budget", error);
            alert("Failed to set budget");
        } finally {
            setLoading(false);
        }
    };

    // Calculate spending per category from stats
    const spendingByCategory = {};
    stats.forEach(stat => {
        spendingByCategory[stat._id] = stat.totalAmount;
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Monthly Budgets</h3>

            {/* Set Budget Form */}
            <form onSubmit={handleSetBudget} className="flex gap-2 mb-4 flex-wrap">
                <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    placeholder="Limit ($)"
                    className="px-3 py-2 border rounded w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    Set Budget
                </button>
            </form>

            {/* Budget Progress Bars */}
            <div className="space-y-3">
                {budgets.length === 0 ? (
                    <p className="text-gray-500 text-sm">No budgets set. Add one above!</p>
                ) : (
                    budgets.map(budget => {
                        const spent = spendingByCategory[budget.category] || 0;
                        const percentage = Math.min((spent / budget.limit) * 100, 100);
                        const isOverBudget = spent > budget.limit;
                        const isNearLimit = percentage >= 80 && !isOverBudget;

                        let barColor = 'bg-green-500';
                        if (isOverBudget) barColor = 'bg-red-500';
                        else if (isNearLimit) barColor = 'bg-yellow-500';

                        return (
                            <div key={budget.category} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{budget.category}</span>
                                    <span className={isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                                        ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`${barColor} h-3 rounded-full transition-all duration-300`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                {isOverBudget && (
                                    <p className="text-xs text-red-500 mt-1">⚠️ Over budget by ${(spent - budget.limit).toFixed(2)}</p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BudgetSection;
