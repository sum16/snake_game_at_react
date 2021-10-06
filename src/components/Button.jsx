import React from "react";

export const Button = ({ status, onStart, onRestart, onStop}) => {
  return (
    <div className="button">
      { status === "gameover" && <button className="btn btn-gameover" onClick={onRestart}>gameover</button> }
      { status === "init" && <button className="btn btn-init" onClick={onStart}>start</button> }
      { status === "suspended" && <button className="btn btn-suspended" onClick={onStart}>start</button> }
      { status === "playing" && <button className="btn btn-playing" onClick={onStop}>stop</button> }
  </div>
  )
}