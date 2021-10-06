// ランダムに表示されるエサがスネークの位置とかぶるのを排除
export const getFoodPosition = (fieldSize, excludes) => {  //excludes 0: { x:17 y: 17 }
  // 壁が34のため-1 & エサの出現可能エリアは一番外側から一個内側にしたいためさらに-1
  // 最小値を 1 としたいので最後に+1  これで1~32のレンジ
  while(true) {
    const x = Math.floor(Math.random() * (fieldSize -1 -1)) + 1
    const y = Math.floor(Math.random() * (fieldSize -1 -1)) + 1
    const conflict = excludes.some(item=> item.x === x && item.y === y)

    if(!conflict) {
      return {x, y};
    } 
  }
}

export const initFields = (fieldSize, snake) => {
  // console.log(fieldSize); →35
  const fields = []
  for(let i=0; i <= fieldSize; i++) {
    const cols = new Array(fieldSize).fill('')
    fields.push(cols)
  }
  fields[snake.y][snake.x] = 'snake'// へび
  const food = getFoodPosition(fieldSize, [snake])
  // console.log(JSON.stringify(food));  例 {"x":32,"y":28}
  fields[food.y][food.x] = 'food' //えさ
  return fields
}

// some 関数はコールバックが一つでも true を返したら true を返す関数
// 排除リストの中に同じ座標が含まれている場合はconflictが true になりそのまま while ループの先頭に戻って再度ランダムな座標を取得する

// ①xかyの値がマイナスでなく、②フィールドサイズより小さい座標に収まっていない場合はぶつかっていると判断してtrueを返すisCollision関数を定義
export const isCollision = (fieldSize, position) => {
   // x,y 座標のどちらかが 0 より小さくなってしまっていることをチェック
  if (position.y < 0 || position.x < 0) {
    // x, y のどちらかの座標がマイナスの値 の時
    return true;
  }
  // x,y 座標がフィールドより大きくなってしまった場合をチェック / fieldSize - 1 としているのは座標データが 0 始まりなので壁は-1とする
  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    // x, y のどちらかの座標がフィールドサイズを超えてしまっている時
    return true;
  }

  return false;
};

export const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake'
}