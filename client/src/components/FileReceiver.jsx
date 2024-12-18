import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Header from './Header';
import Footer from './Footer';

const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
});

const peerConnection = new RTCPeerConnection();

const FileReceiver = () => {
    const [peerId, setPeerId] = useState('');
    const [senderId, setSenderId] = useState('');
    const [fileName, setFileName] = useState('');
    const [downloadStatus, setDownloadStatus] = useState('Waiting for file...');
    const receivedChunks = useRef([]); // Store chunks of the file
    const isDownloading = useRef(false); // Prevent duplicate downloads
    const fileNameRef = useRef(''); // Use ref to keep track of the file name

    useEffect(() => {
        socket.on('connect', () => {
            setPeerId(socket.id);
            console.log('Peer ID:', socket.id);
        });

        // Handle incoming offer from the sender
        socket.on('offer', async (data) => {
            console.log('Offer received from:', data.sender);
            setSenderId(data.sender);
            setDownloadStatus('Receiving');

            // Set the remote description from the offer
            await peerConnection.setRemoteDescription(data.offer);

            // Create and send the answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Emit the answer back to the sender
            socket.emit('answer', { target: data.sender, answer });
        });

        // Handle ICE candidates from the sender
        socket.on('ice-candidate', (data) => {
            peerConnection.addIceCandidate(data.candidate);
        });

        // Set up the data channel for receiving the file
        peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;

            // Reset the chunks array and download flag every time a new transfer begins
            receivedChunks.current = [];
            isDownloading.current = false;

            dataChannel.onmessage = (event) => {
                if (event.data === '{"type":"Sent"}' && !isDownloading.current) {
                    // File transfer complete, reconstruct the file
                    const fileBlob = new Blob(receivedChunks.current);
                    const url = URL.createObjectURL(fileBlob);

                    // Trigger the download
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileNameRef.current || 'received-file'; // Use ref to avoid async state issue
                    link.click();

                    socket.emit('file-received', {
                        fileName: fileName,
                        sender: senderId,
                    });

                    // Mark the file as downloaded
                    isDownloading.current = true;
                    setDownloadStatus('Received');
                } else if (typeof event.data === 'string') {
                    try {
                        const metadata = JSON.parse(event.data);
                        if (metadata.type === 'metadata') {
                            console.log('Metadata received:', metadata);
                            setFileName(metadata.fileName); // Update the state (for UI display)
                            fileNameRef.current = metadata.fileName; // Update ref for immediate use
                            console.log('File name set to:', fileNameRef.current); // Log the updated fileName
                        }
                    } catch (e) {
                        console.error('Error parsing metadata:', e);
                    }
                } else {
                    // Append binary data chunks
                    receivedChunks.current.push(event.data);
                }
            };
        };

        return () => {
            socket.off('offer');
            socket.off('ice-candidate');
        };
    }, []);

    return (
        <div>
            <Header/>
            <div className ="container w-[1200px] h-[640px] m-auto my-8 bg-purple-200 shadow-md shadow-black  " >
            <div className='flex flex-col items-center'>
            <h2 className='text-3xl text-purple-800'>Receive File</h2>
            <p className=' font-semibold mt-4 '>Your Peer ID: {peerId || 'Waiting for connection...'}</p>
            <p className='mt-10 px-12 py-4 border-2 border-purple-800 text-white bg-purple-300 rounded-md'>{fileName ? `${downloadStatus}: ${fileName}` : downloadStatus}</p>
            </div>
            </div>
            <Footer/>
        </div>
    );
};

export default FileReceiver;
