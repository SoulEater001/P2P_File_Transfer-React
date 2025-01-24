import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import socket from '../provider/socket';
// const socket = io('http://localhost:5000', {
//     transports: ['websocket', 'polling'],
// });

const peerConnection = new RTCPeerConnection({
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun.l.google.com:5349",
                "stun:stun1.l.google.com:3478"
            ]
        }
    ]
});

const FileSender = () => {
    const [targetId, setTargetId] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const sendFile = async () => {
        if (!file) return alert('Please select a file first!');
        socket.emit('transfer-start', { target: targetId, fileName: file.name, fileSize: file.size, fileType: file.type });
        // Create a new data channel
        const dataChannel = peerConnection.createDataChannel('file');
        const CHUNK_SIZE = 16 * 1024; // 16 KB

        dataChannel.onopen = () => {
            let offset = 0;

            // Send metadata first
            dataChannel.send(JSON.stringify({ type: 'metadata', fileName: file.name, fileType: file.type, fileSize: file.size }));

            // Use FileReader to read chunks
            const reader = new FileReader();
            reader.onload = () => {
                if (dataChannel.readyState === 'open') {
                    dataChannel.send(reader.result); // Send the chunk
                    offset += CHUNK_SIZE;

                    if (offset < file.size) {
                        readNextChunk(); // Read the next chunk
                    } else {
                        dataChannel.send(JSON.stringify({ type: 'Sent' })); // Signal the transfer is complete
                    }
                }
            };

            const readNextChunk = () => {
                const slice = file.slice(offset, offset + CHUNK_SIZE);
                reader.readAsArrayBuffer(slice);
            };

            readNextChunk(); // Start the reading process
        };

        // Handle offer creation and ICE candidate exchange
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', {
            target: targetId,
            offer,
        });

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { target: targetId, candidate: event.candidate });
            }
        };
    };


    useEffect(() => {
        const handleAnswer = async (data) => {
            await peerConnection.setRemoteDescription(data.answer);
        };

        const handleIceCandidate = (data) => {
            peerConnection.addIceCandidate(data.candidate);
        };

        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);

        return () => {
            // Cleanup socket event listeners
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
        };
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to the server with ID:', socket.id);
        });
    }, []);

    return (
        <div className="flex flex-col justify-evenly space-y-4">
            
            <h2 className='font-bold text-center '>Send Your Files</h2>
            <input  
                className='m-auto border-2 border-purple-800 rounded-md  text-center '
                type="text"
                placeholder="Enter target ID"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
            />
            <div className='container h-[240px] w-[800px] m-auto flex flex-col  justify-center items-center space-y-6 '>
            <input 
            className='bg-purple-400 border-purple-800 text-white border-2 px-2 rounded-md '
            type="file" onChange={handleFileChange} />
            <button 
            className='bg-purple-400 border-purple-800 text-white border-2 p-2 px-10 rounded-md hover:border-purple-200 shadow-md'
            onClick={sendFile}>Send File</button>
            </div>
            {/* <FileReceiver/> */}
        </div>
    );
};

export default FileSender;
