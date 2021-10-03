import { useEffect, useState } from 'react';
import { Button } from './components/Button';
import { Field } from './components/Field';
import { ManipulationPanel } from './components/ManipulationPanel';
import { Navigation } from './components/Navigation';
import {initFields} from "./utils/index"

// デフォルトの座標を指定
const initialPosition = {x: 17, y:17}
// 35 * 35のdivを生成する
const initialValues = initFields(35, initialPosition)
const defaultInterval = 1000
let timer = undefined // timerは関数

const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer) //タイマーを削除
}


function App() {
  // initFieldsで生成したフィールドのデータ（二次元配列）を初期値に設定
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState(); //初期値はいれていないため最初のレンダリングでnullになることに注意
  const [tick, setTick] = useState(0); // 特定の間隔ごとにpositionがundefinedのまま実行されてしまうのを回避する
  // tickは一定時間ごとにインクリメントされるが、ここのインクリメントされる値自体はあまり問題でなく、一定間隔でレンダリングがトリガーされるということが重要
  // useEffectの初回しかレンダリングできない問題を、tickのインクリメントが更新でのレンダリングによって解決している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる



  useEffect(() => {
    setPosition(initialPosition)
    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick(tick => tick + 1);
    }, defaultInterval)
    return unsubscribe // コンポーネントが削除されるタイミングで関数をreturn
  }, [])

  // tickの更新によるレンダリングごとにgoUp関数を実行している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる → ゲームの中の時間が進むたびにgoUp関数が呼ばれる
  useEffect(() => {
    if (!position){  // 初回のレンダリングでpositionがundifineになるため事前にnullチェックをする
      return
    }
    goUp();
  }, [tick])


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

      <footer className="footer">
        <Button />
        <ManipulationPanel />
      </footer>

    </div>
  );
}

export default App;

// Math.max関数は引数に複数の数値を指定すると、その中の最大値を返す
