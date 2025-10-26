import React from 'react';
import './App.css';
import TopicList from './components/TopicList';

function App() {
  return (
    <div className="App" style={{ padding: 24 }}>
      <header className="App-header">
        <h1>Faida Finder — Topics</h1>
        <p style={{ marginTop: 4, color: '#666' }}>
          Browse topics and ask questions. The app talks to the Faida Finder API.
        </p>
      </header>
      <main style={{ marginTop: 20 }}>
        <TopicList />
      </main>
    </div>
  );
}

export default App;
