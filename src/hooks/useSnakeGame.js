import { useCallback, useEffect, useState } from 'react';
import {
  defaultInterval,
  defaultDifficulty,
  initialPosition,
  initialValues,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodeMap,
  GameStatus,
  OppositeDirection,
} from '../constants';
import {
  initFields,
  isCollision,
  isEatingMyself,
  getFoodPosition,
} from '../utils';

let timer = null;

const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);  //タイマーを削除
};

const useSnakeGame = () => {
  // initFieldsで生成したフィールドのデータ（二次元配列）を初期値に設定
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [tick, setTick] = useState(0);
  // tickは一定時間ごとにインクリメントされるが、ここのインクリメントされる値自体はあまり問題でなく、一定間隔でレンダリングがトリガーされるということが重要
  // useEffectの初回しかレンダリングできない問題を、tickのインクリメントが更新でのレンダリングによって解決している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる

  useEffect(() => {
    setBody([initialPosition]);
     // テスト用
    // setBody(
    //   new Array(15).fill('').map((_item, index) => ({ x: 17, y: 17 + index })),
    // )
    // ゲームの中の時間を管理する

    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, interval);
    return unsubscribe;  // コンポーネントが削除されるタイミングで関数を呼ぶ
  }, [difficulty]);

  // tickの更新によるレンダリングごとに関数（進む機能）を実行している →100ミリ秒(defaultIntervalの値）ごとにレンダリングされる → ゲームの中の時間が進むたびに関数が呼ばれる
  useEffect(() => {
    // 進行を止める
    if (body.length === 0 || status !== GameStatus.playing) {
      return;
    }
    // 進行する
    const canContinue = handleMoving();
    if (!canContinue) {
      unsubscribe();
      setStatus(GameStatus.gameover);
    }
  }, [tick]);

  // スタートボタンを押した時にステータスを"playing"にする
  const start = () => setStatus(GameStatus.playing);

  const stop = () => setStatus(GameStatus.suspended);

  const reload = () => {
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    setStatus(GameStatus.init);
    setBody([initialPosition]);
    setDirection(Direction.up);
    setFields(initFields(fields.length, initialPosition));
  };

  // 進行方向を変更する関数  newDirectionには押された矢印のキーコードに対応する'up'やdownが入る
  const updateDirection = useCallback(
    (newDirection) => {
       // ゲームプレイ中だけ方向が変えられる
      if (status !== GameStatus.playing) {
        return;
      }
       // 押された矢印の方向が同じであれば処理を抜ける ゲームのルール上進行方向と真逆への移動は許容しない 
       // 例) directionがrightの場合、OppositeDirection[direction]にはleftが入り、新しい進行方向(newDirection)をleftにすると真逆の制約となるためreturn
      if (OppositeDirection[direction] === newDirection) {
        return;
      }
      setDirection(newDirection);
    },
    [direction, status]
  );

  // 難易度を変更できるようにする関数
  const updateDifficulty = useCallback(
     // 難易度は初期状態（ゲームを始める前）以外の時は変更できないようにする
    (difficulty) => {
      if (status !== GameStatus.init) {
        return;
      }
      if (difficulty < 1 || difficulty > Difficulty.length) {
        return;
      }
      setDifficulty(difficulty);
    },
    [status]
  );

  // 押された矢印のキーコードを取得し、キーコードのプロパティを取得('up'や'down'など) newDirectionには'up'や'down'などのstringが入る
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      updateDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [updateDirection]);
  // 1 回目と 2 回目のイベントの内容はほぼ同じなのですが、イベントが登録された時の状態（ステータスや進行方向）が違うので再度登録し直す必要がある

  // 進行方向を変更する関数
  const handleMoving = () => {
    const { x, y } = body[0];   // オブジェクトの分割代入 positionには{x:17, y:17}、xとyには17,17が入っている
    const delta = Delta[direction];
    console.log(JSON.stringify(delta)); // {"x":0,"y":-1}などが入る
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
    // 壁にぶつかってしまった場合  自分を食べてしまった場合
    if (
      isCollision(fields.length, newPosition) ||
      isEatingMyself(fields, newPosition)
    ) {
      return false;
    }
    // エサを食べない場合 → body の末尾を消す
    const newBody = [...body];
    if (fields[newPosition.y][newPosition.x] !== 'food') {
      const removingTrack = newBody.pop();
      fields[removingTrack.y][removingTrack.x] = '';
    } else {
      // 餌が食べられた場合
      const food = getFoodPosition(fields.length, [...newBody, newPosition]);
      fields[food.y][food.x] = 'food';
    }
     // エサを食べる場合 → body の末尾を消さない（消さないので伸びる)
    fields[newPosition.y][newPosition.x] = 'snake';
    newBody.unshift(newPosition);

    setBody(newBody);
    setFields(fields);
    return true;
  };
  return {
    body,
    difficulty,
    fields,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  };
};

export default useSnakeGame;