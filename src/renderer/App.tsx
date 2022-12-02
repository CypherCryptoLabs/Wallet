import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Overview } from './components/Overview.jsx'
import { Receive } from './components/Receive';
import { Send } from './components/Send';
import { Settings } from './components/Settings';
import { Messenger } from './components/Messenger';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/send" element={<Send />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/messenger" element={<Messenger />} />
      </Routes>
    </Router>
  );
}
