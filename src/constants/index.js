// 定数をまとめるファイル
// 他のファイルで使用する定数は export で外部からの読み込みを許可する
import { initFields } from '../utils'

const fieldSize = 35
// デフォルトの座標を指定
export const initialPosition = {x: 17, y:17}
// 35 * 35のdivを生成する
export const initialValues = initFields(fieldSize, initialPosition)
export const defaultInterval = 300
export const defaultDifficulty = 3
export const Difficulty = [1000, 500, 100, 50, 10]



// ゲームの状態のステータスを定義　freezeメソッドで書き変わらないようにする
export const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
})


export const Direction = Object.freeze({
  up: "up",
  down: "down",
  right: "right",
  left: "lect"
});

export const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})

export const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 }
});

export const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
})
