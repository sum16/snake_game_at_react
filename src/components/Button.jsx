import React from "react";

export const Button = ({ status, onStart, onRestart, onStop}) => {
  return (
    <div className="button">
      {status === 'gameover' &&  <button onClick={onRestart}>gameover</button>}
      {status === 'init' &&  <button onClick={onStart}>start</button>}
      {status === 'suspended' &&  <button onClick={onStart}>start</button>}
      {status === 'playing' &&  <button onClick={onStop}>stop</button>}
  </div>
  )
}