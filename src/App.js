import { useEffect, useState } from 'react';
import { Button } from './components/Button';
import { Field } from './components/Field';
import { ManipulationPanel } from './components/ManipulationPanel';
import { Navigation } from './components/Navigation';
import {initFields} from "./utils/index"


const initialPosition = {x: 17, y:17}
// 35 * 35のdivを生成する
const initialValues = initFields(35, initialPosition)



function App() {
  // initFieldsで生成したフィールドのデータ（二次元配列）を初期値に設定
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState();

  useEffect(() => {
    setPosition(initialPosition)
  }, [])

  const goUp = () => {
    const { x, y } = position  // オブジェクトの分割代入 xとyには17,17が入っている
    console.log(position);
    const nextY = Math.max(y -1, 0) // y座標をデクリメント（1 ずつ減算）していくことでまっすぐ上にスネークが移動していく動きを実現
    fields[y][x] = ''               // スネークの元いた位置を空にする
    fields[nextY][x] = 'snake'      // 次にいる場所を"snake"に変更
    setPosition({ x, y: nextY })    //setPositionでスネークの位置を更新
    setFields(fields)               // setFieldsでフィールドを更新
  }

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
      <div style={{ padding: '16px'}}>
        <button onClick={goUp}>進む</button>
      </div>
      <footer className="footer">
        <Button />
        <ManipulationPanel />
      </footer>

    </div>
  );
}

export default App;

// Math.max関数は引数に複数の数値を指定すると、その中の最大値を返す
