import React, { useState, useEffect } from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete, onDeleteBatch }) => {
    const [selectedIds, setSelectedIds] = useState([]);

    // Clear selection when expenses change (e.g., after a delete)
    useEffect(() => {
        setSelectedIds([]);
    }, [expenses]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(expenses.map(exp => exp._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        onDeleteBatch(selectedIds);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recent Expenses</h3>
                {selectedIds.length > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>
            <table className="min-w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2 px-4 w-10">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={expenses.length > 0 && selectedIds.length === expenses.length}
                                className="w-4 h-4 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500"
                            />
                        </th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Title</th>
                        <th className="py-2 px-4">Category</th>
                        <th className="py-2 px-4">Amount</th>
                        <th className="py-2 px-4">Description</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="py-4 text-center text-gray-500">No expenses found.</td>
                        </tr>
                    ) : (
                        expenses.map((expense) => (
                            <tr key={expense._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(expense._id)}
                                        onChange={() => handleSelectOne(expense._id)}
                                        className="w-4 h-4 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 font-medium">{expense.title}</td>
                                <td className="py-2 px-4">
                                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="py-2 px-4 text-red-600 font-semibold">${expense.amount.toFixed(2)}</td>
                                <td className="py-2 px-4 text-gray-500 text-sm">{expense.description}</td>
                                <td className="py-2 px-4 flex gap-2">
                                    <button onClick={() => onEdit(expense)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                                    <button onClick={() => onDelete(expense._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
