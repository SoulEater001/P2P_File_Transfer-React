import React, { useState, useRef, useEffect } from "react";
import socket, { connectSocket } from "../provider/socket";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";

const FileSender = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [users, setUsers] = useState([]);
    const [targetUser, setTargetUser] = useState("");
    const [file, setFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState(0);

    const peerConnectionRef = useRef(null);
    const transferIdRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        connectSocket(token);

        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/transfer/online-users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data.users);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };

        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleAnswer = async (data) => {
            if (data.transferId === transferIdRef.current && peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.setRemoteDescription(data.answer);
                } catch (err) {
                    console.error("Error setting remote description:", err);
                }
            }
        };

        const handleIce = (data) => {
            if (data.transferId === transferIdRef.current && peerConnectionRef.current) {
                try {
                    peerConnectionRef.current.addIceCandidate(data.candidate);
                } catch (err) {
                    console.error("Error adding ICE candidate:", err);
                }
            }
        };

        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIce);
        return () => {
            socket.off("answer", handleAnswer);
            socket.off("ice-candidate", handleIce);
        };
    }, []);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const sendFile = async () => {
        if (!file || !targetUser) return;
        const target = users.find((u) => u._id === targetUser);
        if (!target) return alert("User not found");

        setSending(true);
        transferIdRef.current = null;

        socket.emit("transfer-start", {
            targetUserId: target._id,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            senderName: localStorage.getItem("username"),
        });

        socket.once("transfer-initiated", ({ transferId }) => {
            transferIdRef.current = transferId;
            startWebRTCAndSend(target._id, transferId);
        });

        const startWebRTCAndSend = async (targetUserId, transferId) => {
            peerConnectionRef.current = new RTCPeerConnection({
                iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
            });
            const pc = peerConnectionRef.current;

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { targetUserId, candidate: event.candidate, transferId });
                }
            };

            const dataChannel = pc.createDataChannel("file");
            const CHUNK_SIZE = 16 * 1024;
            let offset = 0;

            dataChannel.onopen = () => {
                dataChannel.send(JSON.stringify({
                    type: "metadata",
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                }));

                const reader = new FileReader();
                const readNext = () => {
                    const slice = file.slice(offset, offset + CHUNK_SIZE);
                    reader.readAsArrayBuffer(slice);
                };

                reader.onload = () => {
                    dataChannel.send(reader.result);
                    offset += CHUNK_SIZE;
                    setProgress(Math.min((offset / file.size) * 100, 100));
                    if (offset < file.size) readNext();
                    else {
                        dataChannel.send(JSON.stringify({ type: "Sent" }));
                        dataChannel.close();
                        pc.close();
                        setSending(false);
                        alert("File sent. Waiting for receiver confirmation.");
                    }
                };

                reader.onerror = () => {
                    setSending(false);
                    socket.emit("transfer-failed", { transferId });
                };

                readNext();
            };

            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("offer", {
                    targetUserId,
                    offer,
                    senderName: localStorage.getItem("username"),
                    transferId,
                });
            } catch (err) {
                console.error("Offer error:", err);
                socket.emit("transfer-failed", { transferId });
            }
        };
    };

    return (
        <>
            <Header />
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="max-w-xl w-full mx-4 my-10 p-8 bg-white rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">Send File</h2>

                    <select value={targetUser} onChange={(e) => setTargetUser(e.target.value)} className="w-full mb-4 p-3 border rounded">
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
                        ))}
                    </select>

                    <input type="file" onChange={handleFileChange} className="w-full mb-4" />

                    {file && (
                        <div className="mb-4">
                            <p>{file.name} ({Math.round(file.size / 1024)} KB)</p>
                            <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                                <div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-right">{Math.round(progress)}%</p>
                        </div>
                    )}

                    <button onClick={sendFile} disabled={sending || !file || !targetUser} className="w-full py-2 px-6 bg-cyan-500 text-white rounded">
                        {sending ? "Sending..." : "Send File"}
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FileSender;
