import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import FileSender from './components/FileSender';
import FileReceiver from './components/FileReceiver';
import HomePage from './pages/HomePage'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/send" element={<FileSender />} />
      <Route path="/receive" element={<FileReceiver />} />
    </Routes>
  )
}

export default App;
