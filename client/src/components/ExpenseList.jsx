import React from 'react';

const ExpenseList = ({ expenses }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
            <table className="min-w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Title</th>
                        <th className="py-2 px-4">Category</th>
                        <th className="py-2 px-4">Amount</th>
                        <th className="py-2 px-4">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-500">No expenses found.</td>
                        </tr>
                    ) : (
                        expenses.map((expense) => (
                            <tr key={expense._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 font-medium">{expense.title}</td>
                                <td className="py-2 px-4">
                                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="py-2 px-4 text-red-600 font-semibold">${expense.amount.toFixed(2)}</td>
                                <td className="py-2 px-4 text-gray-500 text-sm">{expense.description}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
