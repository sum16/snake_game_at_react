import React from "react";

export const Field = ({ fields }) => {
  return (
    <div className="field">
      {
        fields.map((row) => {
          return row.map((column) => {
            return <div className={`dots ${column}`}></div>
          })
        })
      }
    </div>
  )
}

// Array.fill()は、配列の全要素に同じ値を設定する関数です。 以下の例では、3個の数値配列を生成して値 0 で初期化しています。

//const arr = Array(3).fill(0)