import { useCallback, useEffect, useState } from 'react';
import { Button } from './components/Button';
import { Field } from './components/Field';
import { ManipulationPanel } from './components/ManipulationPanel';
import { Navigation } from './components/Navigation';
import { initFields, getFoodPosition } from './utils'

// デフォルトの座標を指定
const initialPosition = {x: 17, y:17}
// 35 * 35のdivを生成する
const initialValues = initFields(35, initialPosition)
const defaultInterval = 300



// ゲームの状態のステータスを定義　freezeメソッドで書き変わらないようにする
const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
})


const Direction = Object.freeze({
  up: "up",
  down: "down",
  right: "right",
  left: "lect"
});

const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})

const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 }
});

const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
})

let timer = undefined // timerは関数

const unsubscribe = (timer) => {
  if (!timer) {   // timerがundifindだったらreturn
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

const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake'
}

function App() {
  // initFieldsで生成したフィールドのデータ（二次元配列）を初期値に設定
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState(); //初期値はいれていないため最初のレンダリングでnullになることに注意 //フィールドの位置
  const [tick, setTick] = useState(0); // 特定の間隔ごとにpositionがundefinedのまま実行されてしまうのを回避する
  // tickは一定時間ごとにインクリメントされるが、ここのインクリメントされる値自体はあまり問題でなく、一定間隔でレンダリングがトリガーされるということが重要
  // useEffectの初回しかレンダリングできない問題を、tickのインクリメントが更新でのレンダリングによって解決している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる
  const [status, setStatus]= useState(GameStatus.init);
  // 進行方向をステートで管理
  const [direction, setDirection] = useState(Direction.up);
  const [body, setBody] = useState([]) //蛇が伸びる処理


  useEffect(() => {
    setBody([initialPosition])
    // テスト用
    // setBody(
    //   new Array(15).fill('').map((_item, index) => ({ x: 17, y: 17 + index })),
    // )
    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick(tick => tick + 1);
    }, defaultInterval)
    return unsubscribe // コンポーネントが削除されるタイミングで関数を呼ぶ
  }, [])

  // tickの更新によるレンダリングごとに関数（進む機能）を実行している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる → ゲームの中の時間が進むたびに関数が呼ばれる
  useEffect(() => {
    // 進行を止める
    if (body.length === 0 || status !== GameStatus.playing) { // 初回のレンダリングでpositionがundifineになるため事前にnullチェックをする/ 画面を読み込んでもスネークは動かないようする
      return
    }
    // 進行する
    const canContinue = handleMoving()
    if (!canContinue) {
      unsubscribe()
      setStatus(GameStatus.gameover)
    }
  }, [tick])


  // スタートボタンを押した時にステータスを"playing"にする
  const onStart = () => {
    setStatus(GameStatus.playing)
    console.log(status);
  }

  // 進行方向を変更する関数
  const handleMoving = () => {
    const { x, y } = body[0]  // オブジェクトの分割代入 positionには{x:17, y:17}、xとyには17,17が入っている
    console.log(body);
    // const nextY = Math.max(y-1, 0) // y座標をデクリメント（1 ずつ減算）していくことでまっすぐ上にスネークが移動していく動きを実現
    const delta = Delta[direction]
    console.log(JSON.stringify(delta)); // {"x":0,"y":-1}などが入る
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y
    }
    // 壁にぶつかってしまった場合  自分を食べてしまった場合
    if (isCollision(fields.length, newPosition) || isEatingMyself(fields, newPosition)) {
      return false
    }
    // エサを食べない場合 → body の末尾を消す
    const newBody = [...body]
    console.log(newBody);
    if (fields[newPosition.y][newPosition.x] !== 'food') {
      const removingTrack = newBody.pop();
      fields[removingTrack.y][removingTrack.x] = ''
    } else {
      // 餌が食べられた場合
      const food = getFoodPosition(fields.length, [...newBody], newPosition)      
      fields[food.y][food.x] = 'food'
    }
    // エサを食べる場合 → body の末尾を消さない（消さないので伸びる)
    fields[newPosition.y][newPosition.x] = 'snake'
    newBody.unshift(newPosition)    
    setBody(newBody)             //スネークの位置を更新  
    setFields(fields)               // setFieldsでフィールドを更新
    return true
  }

  // 進行方向を変更する関数  newDirectionには押された矢印のキーコードに対応する'up'やdownが入る
  const onChangeDirection = useCallback((newDirection) => {
    // ゲームプレイ中だけ方向が変えられる
    if(status !== GameStatus.playing) {
      return direction
    }
    // 押された矢印の方向が同じであれば処理を抜ける ゲームのルール上進行方向と真逆への移動は許容しない 
    // 例) directionがrightの場合、OppositeDirection[direction]にはleftが入り、新しい進行方向(newDirection)をleftにすると真逆の制約となるためreturn
    if(OppositeDirection[direction] === newDirection) {
      return
    }
    setDirection(newDirection);
  }, [direction, status])

// 押された矢印のキーコードを取得し、キーコードのプロパティを取得('up'や'down'など) newDirectionには'up'や'down'などのstringが入る
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown)
  },[onChangeDirection])
  // 1 回目と 2 回目のイベントの内容はほぼ同じなのですが、イベントが登録された時の状態（ステータスや進行方向）が違うので再度登録し直す必要がある


  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval)
    setDirection(Direction.up)
    setStatus(GameStatus.init)
    setPosition(initialPosition)
    setFields(initFields(35, initialPosition))
  }

  // console.log('進行方向', direction)
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
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>

    </div>
  );
}

export default App;

// Math.max関数は引数に複数の数値を指定すると、その中の最大値を返す
