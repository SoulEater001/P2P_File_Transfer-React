import React, { useState, useRef,useEffect } from "react";
import socket, { connectSocket } from "../provider/socket";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";

const FileSender = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [users, setUsers] = useState([]); // List of online users
    const [targetUser, setTargetUser] = useState(""); // Selected username/email
    const [file, setFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const peerConnectionRef = useRef(null);

    // Fetch online users from backend
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // 1️⃣ Authenticate the socket first
        connectSocket(token);

        // 2️⃣ Fetch online users after authentication
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/transfer/online-users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data.users);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };

        fetchUsers();

        // Optional: refresh online users every 5-10 seconds
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setProgress(0);
    };

    const sendFile = async () => {
        if (!file || !targetUser) return;

        const target = users.find((u) => u._id === targetUser);
        if (!target) return alert("User not found");

        setSending(true);

        peerConnectionRef.current = new RTCPeerConnection({
            iceServers: [
                { urls: ["stun:stun.l.google.com:19302"] },
                { urls: ["stun:stun.l.google.com:5349"] },
            ],
        });
        const peerConnection = peerConnectionRef.current;

        // Notify server
        socket.emit("transfer-start", {
            targetUserId: target._id,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
        });

        const dataChannel = peerConnection.createDataChannel("file");
        const CHUNK_SIZE = 16 * 1024;
        let offset = 0;

        dataChannel.onopen = () => {
            dataChannel.send(
                JSON.stringify({
                    type: "metadata",
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                })
            );

            const reader = new FileReader();

            const readNextChunk = () => {
                const slice = file.slice(offset, offset + CHUNK_SIZE);
                reader.readAsArrayBuffer(slice);
            };

            reader.onload = () => {
                if (dataChannel.readyState === "open") {
                    dataChannel.send(reader.result);
                    offset += CHUNK_SIZE;
                    setProgress(Math.min((offset / file.size) * 100, 100));

                    if (offset < file.size) readNextChunk();
                    else {
                        dataChannel.send(JSON.stringify({ type: "Sent" }));
                        dataChannel.close();
                        peerConnection.close(); // ✅ cleanup
                        setSending(false);
                        alert("File sent successfully!");
                    }
                }
            };

            reader.onerror = (err) => {
                console.error("FileReader error:", err);
                setSending(false);
            };

            readNextChunk();
        };

        dataChannel.onerror = (err) => {
            console.error("Data channel error:", err);
            setSending(false);
        };

        // Create WebRTC offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", {
            targetUserId: target._id,
            offer,
            senderName: localStorage.getItem("username"),
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    targetUserId: target._id,
                    candidate: event.candidate,
                });
            }
        };
    };


    useEffect(() => {
        const handleAnswer = async (data) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(data.answer);
            }
        };
        const handleIce = (data) => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.addIceCandidate(data.candidate);
            }
        };

        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIce);

        return () => {
            socket.off("answer", handleAnswer);
            socket.off("ice-candidate", handleIce);
        };
    }, []);

    return (
        <>
            <Header />
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="max-w-xl w-full mx-4 my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Send Your File</h2>

                    <select
                        className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        value={targetUser}
                        onChange={(e) => setTargetUser(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>
                                {u.username} ({u.email})
                            </option>
                        ))}
                    </select>

                    <input
                        className="w-full mb-4 px-4 py-2 border rounded-lg file:bg-cyan-500 file:text-white file:px-4 file:py-2 file:rounded-lg hover:file:bg-cyan-600"
                        type="file"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <div className="mb-4">
                            <p className="text-gray-700">
                                Selected File: <span className="font-semibold">{file.name}</span> (
                                {Math.round(file.size / 1024)} KB)
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                <div
                                    className="bg-cyan-500 h-3 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-700 mt-1 text-right">{Math.round(progress)}%</p>
                        </div>
                    )}

                    <button
                        className={`w-full py-2 px-6 rounded-lg font-semibold text-white shadow-md transition ${sending || !file || !targetUser ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
                            }`}
                        onClick={sendFile}
                        disabled={sending || !file || !targetUser}
                    >
                        {sending ? "Sending..." : "Send File"}
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FileSender;
