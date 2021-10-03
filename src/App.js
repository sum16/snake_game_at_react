import { Button } from './components/Button';
import { Field } from './components/Field';
import { ManipulationPanel } from './components/ManipulationPanel';
import { Navigation } from './components/Navigation';
import {initFields} from "./utils/index"

// 35 * 35のdivを生成する
const fields = initFields(35)


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
      <Field fields={fields} />
      </main>
      <footer className="footer">
        <Button />
        <ManipulationPanel />
      </footer>

    </div>
  );
}

export default App;
