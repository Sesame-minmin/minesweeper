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

  const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  const isFailure = userInputs.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );

  const gameJudge = () => {
    let judge = 0;
    if (isPlaying) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (bombMap[j][i] === 1 && userInputs[j][i] === 3) {
            judge++;
          }
        }
      }
      if (judge === bombCount) {
        return true;
      }
    }
    console.log(judge);
    return false;
  };

  //const[timer,setTimer]=({statedTime:0,curruentTime:0,});
  //const displayTime = Math.floow((timer.currentTime - timer.startedTime) / 1000)

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

  const lightNumber: number[][] = [
    [3, 3, 0, 3, 0, 3, 3, 3],
    [0, 3, 0, 0, 0, 3, 0, 0],
    [3, 3, 2, 0, 2, 0, 3, 3],
    [3, 0, 3, 2, 2, 0, 3, 3],
    [0, 3, 3, 2, 2, 0, 0, 3],
    [3, 3, 2, 0, 2, 3, 3, 3],
    [3, 3, 2, 0, 2, 3, 3, 0],
    [3, 0, 0, 3, 0, 0, 0, 3],
    [3, 3, 2, 3, 2, 3, 3, 3],
    [3, 3, 3, 2, 2, 3, 2, 0],
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
          board[j][i] = 9;
        } else if (userInputs[j][i] === 3) {
          board[j][i] = 10;
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
    //左クリックの挙動
    const newBombMap: number[][] = JSON.parse(JSON.stringify(bombMap)); //ボムの数が規定に達するまでボムを生成
    const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
    while (newBombMap.flat().filter(Boolean).length < bombCount) {
      const bombY = Math.floor(Math.random() * 9);
      const bombX = Math.floor(Math.random() * 9);
      if (newBombMap[bombY][bombX] !== 1 && !(x === bombX && y === bombY)) {
        newBombMap[bombY][bombX] = 1;
      }
    }
    if (!isFailure && !gameJudge() && board[y][x] !== 10) {
      //負けていないかつ、勝っていないかつ、旗を立てていない場所をクリックした場合。
      newUserInputs[y][x] = 1;
    }
    setBombMap(newBombMap);
    setUserInputs(newUserInputs);

    console.log(bombMap.flat().filter(Boolean).length);
    console.log(y, x);
  };

  const onClickr = (x: number, y: number) => {
    //右クリックの挙動
    if (!isFailure) {
      const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
      if (board[y][x] < 0 || 8 < board[y][x]) {
        newUserInputs[y][x] =
          userInputs[y][x] === 0 ? 3 : userInputs[y][x] === 3 ? 2 : userInputs[y][x] === 2 ? 0 : 1;
        setUserInputs(newUserInputs);
      }
    }
    document.getElementsByTagName('html')[0].oncontextmenu = function () {
      return false;
    };
  };

  const newGame = () => {
    //盤面のリセット
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
  console.log(gameJudge());

  return (
    <div className={styles.container}>
      <div className={styles.mainboard}>
        <div className={styles.gameboard}>
          <div className={styles.bombboard}>
            <div className={styles.timetop} />
            <div className={styles.timebottom} />
            <div className={styles.timetop} />
            <div className={styles.timebottom} />
            <div className={styles.timetop} style={{ marginRight: '2px' }} />
            <div className={styles.timebottom} style={{ marginRight: '2px' }} />
          </div>
          <div
            className={styles.newgame}
            onClick={() => newGame()}
            style={{ backgroundPosition: isFailure ? -390 : gameJudge() ? -360 : -330 }}
          />
          <div className={styles.timeboard}>
            <div className={styles.timetop} />
            <div className={styles.timebottom} />
            <div className={styles.timetop} />
            <div className={styles.timebottom} />
            <div className={styles.timetop} style={{ marginRight: '2px' }} />
            <div className={styles.timebottom} style={{ marginRight: '2px' }} />
          </div>
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
                  backgroundPosition: (color - 1) * -30,
                  border:
                    color === -1
                      ? '4px outset#aaa'
                      : color === 9
                      ? '4px outset#aaa'
                      : color === 10
                      ? '4px outset#aaa'
                      : '1px solid #777',

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
