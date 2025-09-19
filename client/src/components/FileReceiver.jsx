import React, { useState, useEffect, useRef } from "react";
import socket, { connectSocket } from "../provider/socket";
import Header from "./Header";
import Footer from "./Footer";

const FileReceiver = () => {
    const [peerId, setPeerId] = useState("");
    const [senderName, setSenderName] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [downloadStatus, setDownloadStatus] = useState("Waiting for file...");
    const [progress, setProgress] = useState(0);

    const peerConnectionRef = useRef(null);
    const receivedChunks = useRef([]);
    const fileNameRef = useRef("");
    const isDownloading = useRef(false);

    const resetTransfer = () => {
        receivedChunks.current = [];
        isDownloading.current = false;
        setProgress(0);
        setFileName("");
        setFileSize(0);
        fileNameRef.current = "";
        setDownloadStatus("Waiting for file...");
        setSenderName("");
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        connectSocket(token, () => {
            setPeerId(socket.id);
        });

        socket.on("connect", () => setPeerId(socket.id));

        // Handle incoming WebRTC offer
        socket.on("offer", async (data) => {
            resetTransfer();

            setSenderName(data.senderName || "Unknown");
            setDownloadStatus("Receiving...");

            peerConnectionRef.current = new RTCPeerConnection({
                iceServers: [
                    { urls: ["stun:stun.l.google.com:19302"] },
                    { urls: ["stun:stun.l.google.com:5349"] },
                ],
            });
            const peerConnection = peerConnectionRef.current;

            peerConnection.ondatachannel = (event) => {
                const dataChannel = event.channel;

                dataChannel.onmessage = (event) => {
                    try {
                        const parsed = JSON.parse(event.data);
                        if (parsed.type === "metadata") {
                            setFileName(parsed.fileName);
                            fileNameRef.current = parsed.fileName;
                            setFileSize(parsed.fileSize);
                            return;
                        }
                        if (parsed.type === "Sent") {
                            const fileBlob = new Blob(receivedChunks.current);
                            const url = URL.createObjectURL(fileBlob);

                            const link = document.createElement("a");
                            link.href = url;
                            link.download = fileNameRef.current || "received-file";
                            link.click();

                            socket.emit("file-received", {
                                fileName: fileNameRef.current,
                                senderUserId: data.senderUserId,
                            });

                            setDownloadStatus("Received");
                            setProgress(100);

                            // ✅ cleanup
                            dataChannel.close();
                            peerConnection.close();
                            return;
                        }
                    } catch {
                        receivedChunks.current.push(event.data);
                        if (fileSize > 0) {
                            const receivedBytes = receivedChunks.current.reduce(
                                (acc, chunk) => acc + (chunk.byteLength || chunk.size || 0),
                                0
                            );
                            setProgress(Math.min((receivedBytes / fileSize) * 100, 100));
                        }
                    }
                };
            };

            await peerConnection.setRemoteDescription(data.offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit("answer", { targetUserId: data.senderUserId, answer });
        });

        socket.on("ice-candidate", (data) => {
            if (
                data?.candidate &&
                peerConnectionRef.current &&
                peerConnectionRef.current.signalingState !== "closed"
            ) {
                peerConnectionRef.current.addIceCandidate(data.candidate)
                    .catch(err => console.error("ICE add error:", err));
            }
        });

        // ✅ Proper cleanup inside useEffect
        return () => {
            socket.off("offer");
            socket.off("ice-candidate");
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-grow flex items-center justify-center py-10">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        Receive File
                    </h2>
                    <p className="text-center text-gray-600 mb-2">Connected to:</p>
                    <p className="text-center text-cyan-600 font-semibold mb-4">
                        {senderName || "Waiting for sender..."}
                    </p>

                    <div className="p-4 mb-4 text-center bg-cyan-100 border border-cyan-400 rounded-lg">
                        <p className="text-gray-700 font-medium">
                            {fileName ? `${downloadStatus}: ${fileName}` : downloadStatus}
                        </p>
                    </div>

                    {fileName && downloadStatus !== "Received" && (
                        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
                            <div
                                className="bg-cyan-500 h-3 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 text-center">
                        Files are received securely via P2P. You will be prompted to
                        download once completed.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FileReceiver;
