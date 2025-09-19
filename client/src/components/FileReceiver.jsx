import React, { useState, useEffect, useRef } from "react";
import socket, { connectSocket } from "../provider/socket";
import Header from "./Header";
import Footer from "./Footer";

const FileReceiver = () => {
    const [senderName, setSenderName] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [status, setStatus] = useState("Waiting...");
    const [progress, setProgress] = useState(0);

    const pcRef = useRef(null);
    const isCompleted = useRef(false);
    const transferIdRef = useRef(null);
    const chunksRef = useRef([]);
    const fileNameRef = useRef("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // Connect and authenticate socket
        connectSocket(token);

        // Handle ICE candidates
        socket.on("ice-candidate", (data) => {
            if (data.transferId === transferIdRef.current && pcRef.current) {
                pcRef.current.addIceCandidate(data.candidate).catch((err) => console.error(err));
            }
        });

        // Handle incoming offer
        socket.on("offer", async (data) => {
            transferIdRef.current = data.transferId;
            setSenderName(data.senderName);
            setStatus("Receiving...");
            chunksRef.current = [];
            fileNameRef.current = "";
            setFileName("");
            setFileSize(0);
            setProgress(0);
            isCompleted.current = false;

            pcRef.current = new RTCPeerConnection({
                iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
            });

            pcRef.current.ondatachannel = (event) => {
                const dc = event.channel;

                dc.onmessage = (event) => {
                    if (isCompleted.current) return; // Ignore if already completed

                    try {
                        const parsed = JSON.parse(event.data);

                        if (parsed.type === "metadata") {
                            setFileName(parsed.fileName);
                            setFileSize(parsed.fileSize);
                            fileNameRef.current = parsed.fileName;
                        } else if (parsed.type === "Sent") {
                            const blob = new Blob(chunksRef.current);
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = fileNameRef.current;
                            link.click();

                            socket.emit("file-received", { transferId: transferIdRef.current });
                            setStatus("Received");
                            setProgress(100);
                            isCompleted.current = true;

                            dc.close();
                            if (pcRef.current) pcRef.current.close();
                        }
                    } catch {
                        // Raw chunk
                        chunksRef.current.push(event.data);
                        if (fileSize > 0) {
                            const receivedBytes = chunksRef.current.reduce(
                                (acc, chunk) => acc + (chunk.byteLength || chunk.size || 0),
                                0
                            );
                            setProgress(Math.min((receivedBytes / fileSize) * 100, 100));
                        }
                    }
                };

                dc.onerror = () => {
                    if (isCompleted.current) return;
                    setStatus("Error");
                    socket.emit("transfer-failed", { transferId: transferIdRef.current });
                    isCompleted.current = true;
                };
            };

            try {
                await pcRef.current.setRemoteDescription(data.offer);
                const answer = await pcRef.current.createAnswer();
                await pcRef.current.setLocalDescription(answer);

                socket.emit("answer", {
                    targetUserId: data.senderUserId,
                    answer,
                    transferId: transferIdRef.current,
                });
            } catch (err) {
                console.error("Error handling offer:", err);
                setStatus("Error");
                socket.emit("transfer-failed", { transferId: transferIdRef.current });
                isCompleted.current = true;
            }
        });

        // Cleanup on unmount
        return () => {
            socket.off("offer");
            socket.off("ice-candidate");
            if (pcRef.current) pcRef.current.close();
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-4">Receive File</h2>
                    <p className="text-center text-gray-600 mb-2">From: {senderName || "Waiting..."}</p>
                    <p className="text-center text-gray-700 mb-4">{status}</p>
                    {fileName && (
                        <div>
                            <p className="mb-2">{fileName} ({Math.round(fileSize / 1024)} KB)</p>
                            <div className="w-full bg-gray-200 h-3 rounded-full">
                                <div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FileReceiver;
