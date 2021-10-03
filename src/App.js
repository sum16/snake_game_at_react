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
// ゲームの状態のステータスを定義　freezeメソッドで書き変わらないようにする
const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
})

let timer = undefined // timerは関数

const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer) //タイマーを削除
}

// ①xかyの値がマイナスでなく、②フィールドサイズより小さい座標に収まっていない場合はぶつかっていると判断してtrueを返すisCollision関数を定義
const isCollision = (fieldSize, position) => {
  // x,y 座標のどちらかが 0 より小さくなってしまっていることをチェック
  if (position.y < 0 || position.x < 0)  {
    return true;
  }
  // x,y 座標がフィールドより大きくなってしまった場合をチェック / fieldSize - 1 としているのは座標データが 0 始まりなので壁は-1とする
  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    return true;
  }
  return false;
};


function App() {
  // initFieldsで生成したフィールドのデータ（二次元配列）を初期値に設定
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState(); //初期値はいれていないため最初のレンダリングでnullになることに注意 //フィールドの位置
  const [tick, setTick] = useState(0); // 特定の間隔ごとにpositionがundefinedのまま実行されてしまうのを回避する
  // tickは一定時間ごとにインクリメントされるが、ここのインクリメントされる値自体はあまり問題でなく、一定間隔でレンダリングがトリガーされるということが重要
  // useEffectの初回しかレンダリングできない問題を、tickのインクリメントが更新でのレンダリングによって解決している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる
  const [status, setStatus]= useState(GameStatus.init);


  useEffect(() => {
    setPosition(initialPosition)
    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick(tick => tick + 1);
    }, defaultInterval)
    return unsubscribe // コンポーネントが削除されるタイミングで関数をreturn
  }, [])

  // tickの更新によるレンダリングごとにgoUp関数（進む機能）を実行している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる → ゲームの中の時間が進むたびにgoUp関数が呼ばれる
  useEffect(() => {
    // 進行を止める
    if (!position || status !== GameStatus.playing){  // 初回のレンダリングでpositionがundifineになるため事前にnullチェックをする/ 画面を読み込んでもスネークは動かないようする
      return
    }
    // 進行する
    const canContinue = goUp()
    if (!canContinue) {
      unsubscribe()
      setStatus(GameStatus.gameover)
    }
  }, [tick])


  // スタートボタンを押した時にステータスを"playing"にスネークが動かせる
  const onStart = () => {
    setStatus(GameStatus.playing)
    console.log(status);
  }


  const goUp = () => {
    const { x, y } = position  // オブジェクトの分割代入 positionには{x:17, y:17}、xとyには17,17が入っている
    console.log(position);
    // const nextY = Math.max(y-1, 0) // y座標をデクリメント（1 ずつ減算）していくことでまっすぐ上にスネークが移動していく動きを実現
    const newPosition = { x, y: y -1 }
    if (isCollision(fields.length, newPosition)) {
      unsubscribe()
      return false
    }
    fields[y][x] = ''               // スネークの元いた位置を空にする
    // fields[nextY][x] = 'snake'      // 次にいる場所を"snake"に変更
    fields[newPosition.y][x] = 'snake'
    setPosition(newPosition)         //setPositionでスネークの位置を更新  
    setFields(fields)               // setFieldsでフィールドを更新
    return true
  }

  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval)
    // setDirection(Direction.up)
    setStatus(GameStatus.init)
    setPosition(initialPosition)
    setFields(initFields(35, initialPosition))
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
        <Button status={status} onStart={onStart} onRestart={onRestart}/>
        <ManipulationPanel />
      </footer>

    </div>
  );
}

export default App;

// Math.max関数は引数に複数の数値を指定すると、その中の最大値を返す
