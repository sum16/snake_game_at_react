import './App.css';
import { Button } from './components/Button';
import { Field } from './components/Field';
import { ManipulationPanel } from './components/ManipulationPanel';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation/>
      </header>
      <main className="main">
        <Field/>
      </main>
      <footer className="footer">
        <Button />
        <ManipulationPanel />
      </footer>

    </div>
  );
}

export default App;
