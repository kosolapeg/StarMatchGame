import { useState, useEffect } from "react";
import "./MatchStar.css";

const Stars = ({ count }) => {
  return utils
    .range(1, count)
    .map((starId) => <div className="star" key={starId} />);
};

const PlayNumber = ({ number, status, onClick }) => {
  return (
    <button
      style={{ backgroundColor: colors[status] }}
      className="number"
      key={number}
      onClick={() => onClick(number, status)}
    >
      {number}
    </button>
  );
};

const PlayAgain = ({ gameStatus, onClick }) => {
  return (
    <div className="game-done">
      <div
        className="message"
        style={{ color: gameStatus === "won" ? "green" : "red" }}
      >
        {gameStatus === "lost" ? "YOU LOST" : "YOU WIN"}
      </div>
      <button type="button" onClick={onClick}>
        Play AGAIN
      </button>
    </div>
  );
};

const MatchStar = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  });

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus =
    availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
    setSecondsLeft(10);
  };

  const numberSatus = (num) => {
    if (candidateNums.includes(num))
      return candidatesAreWrong ? "wrong" : "candidate";

    if (!availableNums.includes(num)) return "used";

    return "available";
  };

  const onClickNumber = (number, currentStatus) => {
    // currentStatus => newStatus
    console.log("Num", number, ", status: ", currentStatus);
    if (currentStatus == "used") return;

    const newCandidateNums =
      currentStatus == "available"
        ? candidateNums.concat(number)
        : candidateNums.filter((n) => n !== number);

    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );

      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "active" ? (
            <PlayAgain onClick={resetGame} gameStatus={gameStatus} />
          ) : (
            <Stars count={stars} />
          )}
        </div>

        <div className="right">
          {utils.range(1, 9).map((number) => (
            <PlayNumber
              number={number}
              key={number}
              status={numberSatus(number)}
              onClick={onClickNumber}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue",
};

const utils = {
  sum: (nums) => nums.reduce((num, acc) => num + acc, 0),
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => i + 1),
  random: (min, max) => Math.floor(min + Math.random() * (max - min)),

  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default MatchStar;
