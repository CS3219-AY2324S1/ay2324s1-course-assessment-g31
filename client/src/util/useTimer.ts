import { useState, useRef, useEffect } from "react";

const useTimer = (timeLimit: number) => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef(null as unknown as NodeJS.Timer);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime + 1 > timeLimit) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            return timeLimit;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setTime(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLimit]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
  };

  const percent = timeLimit !== 0 ? Math.round((time / timeLimit) * 100) : 0;

  return { time, startTimer, stopTimer, resetTimer, isActive, percent };
};

export default useTimer;
