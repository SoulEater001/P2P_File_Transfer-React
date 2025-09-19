import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [history, setHistory] = useState([]); // Store history data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch transfer history on component mount
  const fetchHistory = async () => {
    try {
      // Assuming the token is stored in localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token missing");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/transfer/history`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to the request
        },
      });

      // Set the fetched history
      setHistory(response.data.history);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Error fetching history. Please try again.");
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  useEffect(() => {

    fetchHistory();
  }, []);

  // Render loading, error, or history data
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Transfer History</h2>
      <ul>
        {history.length > 0 ? (
          history.map((item) => (
            <li key={item._id}>
              <p>Date: {new Date(item.transferDate).toLocaleString()}</p>
              <p>Details: {item.details}</p>
            </li>
          ))
        ) : (
          <p>No transfer history available.</p>
        )}
      </ul>
    </div>
  );
}

export default History;
