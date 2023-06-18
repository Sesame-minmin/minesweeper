import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // 0-> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const bombCount = 10;
  const directions = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];
  // 0 -> ボムなし
  // 1 -> ボムあり
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  //なくてもできちゃったな
  const isFailure = userInputs.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );
  // -1 -> 石
  // 0 -> 画像なしセル
  // 1~8 -> 数字セル
  // 9 -> 石＋はてな
  // 10 -> 石＋旗
  // 11 -> ボムセル
  const board: number[][] = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];
  const makeBoard = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (isFailure) {
          if (bombMap[j][i] === 1) {
            board[j][i] = 11;
          }
        }
        if (userInputs[j][i] === 1) {
          search(i, j);
        } else if (userInputs[j][i] === 2) {
          board[j][i] = 10;
        } else if (userInputs[j][i] === 3) {
          board[j][i] = 9;
        }
      }
    }
  };
  const search = (x: number, y: number) => {
    if (
      bombMap[y] !== undefined &&
      bombMap[y][x] !== undefined &&
      board[y][x] === -1 &&
      bombMap[y][x] !== 1
    ) {
      let count = 0;
      for (const d of directions) {
        if (bombMap[y + d[0]] !== undefined && bombMap[y + d[0]][x + d[1]] === 1) {
          count += 1;
        }
      }
      board[y][x] = count;
      if (count === 0) {
        for (const d of directions) {
          search(x + d[1], y + d[0]);
        }
      }
    }
  };

  const onClick = (x: number, y: number) => {
    const newBombMap: number[][] = JSON.parse(JSON.stringify(bombMap));
    const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
    while (newBombMap.flat().filter(Boolean).length < bombCount) {
      const bombY = Math.floor(Math.random() * 9);
      const bombX = Math.floor(Math.random() * 9);
      if (newBombMap[bombY][bombX] !== 1 && !(x === bombX && y === bombY)) {
        newBombMap[bombY][bombX] = 1;
      }
    }
    if (!isFailure && board[y][x] !== 10) {
      newUserInputs[y][x] = 1;
    }
    setBombMap(newBombMap);
    setUserInputs(newUserInputs);

    console.log(bombMap.flat().filter(Boolean).length);
    console.log(y, x);
  };
  const onClickr = (x: number, y: number) => {
    if (!isFailure) {
      const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
      if (board[y][x] < 0 || 8 < board[y][x]) {
        newUserInputs[y][x] =
          userInputs[y][x] === 0 ? 2 : userInputs[y][x] === 2 ? 3 : userInputs[y][x] === 3 ? 0 : 1;
        setUserInputs(newUserInputs);
      }
    }
    document.getElementsByTagName('html')[0].oncontextmenu = function () {
      return false;
    };
  };

  const newGame = () => {
    const newBombMap: number[][] = JSON.parse(JSON.stringify(bombMap));
    const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        newBombMap[j][i] = 0;
        newUserInputs[j][i] = 0;
        board[j][i] = -1;
      }
    }
    setBombMap(newBombMap);
    setUserInputs(newUserInputs);
  };
  makeBoard();
  console.table(bombMap);
  console.table(board);
  return (
    <div className={styles.container}>
      <div className={styles.mainBoard}>
        <div className={styles.gameboard}>
          <div className={styles.newgame} onClick={() => newGame()} />
        </div>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.cell}
                key={`${x}-${y}`}
                onClick={() => onClick(x, y)}
                onContextMenu={() => onClickr(x, y)}
                style={{
                  border: color === -1 ? '4px outset#aaa' : '1px solid #777',

                  backgroundPosition: (color - 1) * -30,
                  backgroundColor: bombMap[y][x] === 1 && userInputs[y][x] === 1 ? '#f11' : '#bbb',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
