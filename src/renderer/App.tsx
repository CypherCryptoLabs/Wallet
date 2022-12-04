import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Overview } from './components/Overview.jsx'
import { Receive } from './components/Receive';
import { Send } from './components/Send';
import { Settings } from './components/Settings';
import { Messenger } from './components/Messenger';
import { CreateChat } from './components/CreateChat';
import Chat from './components/Chat';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/send" element={<Send />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/messenger" element={<Messenger />} />
        <Route path="/messenger/create" element={<CreateChat />} />
        <Route path="/messenger/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}
