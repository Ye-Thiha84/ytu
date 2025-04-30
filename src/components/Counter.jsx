import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">React Counter</h2>
      <p className="text-lg mb-4">Count: {count}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}