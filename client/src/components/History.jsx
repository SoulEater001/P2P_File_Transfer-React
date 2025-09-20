import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token missing");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/transfer/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Error fetching history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Transfer History</h2>

      {history.length > 0 ? (
        <ul className="space-y-4">
          {history.map((item) => (
            <li
              key={item._id}
              className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-gray-700">
                  📂 {item.fileName}{" "}
                  <span className="text-sm text-gray-500">({(item.fileSize / 1024).toFixed(2)} KB)</span>
                </p>
                <p className="text-sm text-gray-600">Type: {item.fileType}</p>
                <p className="text-sm text-gray-600">
                  From: <span className="font-medium">{item.sender?.username || "Unknown"}</span>
                </p>
                <p className="text-sm text-gray-600">
                  To: <span className="font-medium">{item.receiver?.username || "Unknown"}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(item.transferDate).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${item.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No transfer history available.</p>
      )}
    </div>
  );
}

export default History;
