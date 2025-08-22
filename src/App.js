import React from 'react';
import './App.css';
import ProjectBoard from './components/ProjectBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Project Management Dashboard</h1>
      </header>
      <main>
        <ProjectBoard />
      </main>
    </div>
  );
}

export default App;
