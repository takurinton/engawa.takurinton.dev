import { Box } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useCallback, useEffect, useState } from "react";

export const App = () => {
  return (
    <Box>
      <SushiModal />
    </Box>
  )
}

type GameState = 'ready' | 'playing' | 'finish' | 'stop';

const SushiModal = () => {
  const TEXT = 'takurinton';
  const len = TEXT.length;
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState(0);
  const [state, setState] = useState<GameState>('ready');
  const [reset, setReset] = useState(false);
  const [finishTime, setFinishTime] = useState(0);

  const handleKeyDown = useCallback((event) => {
    if (state === 'ready') {
      if ('Enter' === event.key) {
        console.log('start play');
        setReset(false);
        setState('playing');
      }
    } else if (state === 'finish') {
      if ('Escape' === event.key) {
        console.log('reset');
        setCount(0);
        setPos(0);
        setReset(true);
        setState('ready');
      }
    } else {
      if ('Escape' === event.key) {
        console.log('stop');
        setState('ready');
      }
      if (pos < len - 1) {
        if (TEXT[pos] === event.key) {
          if (count === 2 && pos === len - 2) { // 9
            // finish
            setState('finish');
            setCount(c => c + 1);
          }
          setPos(p => p + 1);
        }
      } else if (TEXT[len-1] === event.key) { // 最後の1文字
        setPos(0);
        setCount(c => c + 1);
      }
    }
  }, [pos, count, state]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pos, count, state]);

  switch (state) {
    case 'ready':
      return <Ready />;
    case 'playing':
      return <Playing pos={pos} count={count} reset={reset} state={state} text={TEXT} getFinishTime={setFinishTime} />;
    case 'finish':
      return <Finish finishTime={finishTime} />;
    default:
      return <Box>検知できないステート</Box>
  }
}

const Playing = ({
  pos,
  count,
  reset,
  state,
  text,
  getFinishTime,
}: {
  pos: number;
  count: number;
  reset: boolean;
  text: string;
  state: GameState;
  getFinishTime: (time: number) => void;
}) => {
  return (
    <Box>
      スタート！！
      <MarkCurrentText text={text} pos={pos} />
      <Counter count={count} />
      <Timer state={state} reset={reset} getFinishTime={getFinishTime} />
    </Box>
  )
}

const Ready = () => {
  return (
    <Box>
      <chakra.p>よーい</chakra.p>
      <chakra.p>（Enterを押してスタート）</chakra.p>
    </Box>
  )
}

const Finish = ({
  finishTime
}: {
  finishTime: number;
}) => {
  return (
    <Box>
      <chakra.p>終了！</chakra.p>
      <chakra.p>結果: {`${finishTime/1000}${(finishTime / 1000) % 1 === 0 ? '.0' : ''}`}秒</chakra.p>
    </Box>
  )
}

const Counter = ({
  count,
}: {
  count: number;
}) => {
  return <chakra.p>{count}</chakra.p>
}

const Timer = ({
  state,
  reset,
  getFinishTime,
}: {
  state: GameState;
  reset: boolean;
  getFinishTime: (time: number) => void;
}) => {
  const [timerId, setTimerId] = useState(null as any);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (state === 'playing') {
      clearInterval(timerId);
      let timer = setInterval(() => {
        setTime(t => t + 100);
      }, 100);
      setTimerId(timer);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [state]);

  useEffect(() => {
    getFinishTime(time);
  }, [time]);

  useEffect(() => {
    if (reset) setTime(0);
  }, [reset]);

  return (
    <Box>
      {`${time/1000}${(time / 1000) % 1 === 0 ? '.0' : ''}`}秒
    </Box>
  );
}

const MarkCurrentText = ({
  text, 
  pos,
}: { 
  text: string;
  pos: number;
}) => {
  const [chars, setChars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setChars([]);
    for (let i = 0; i < text.length; i++) {
      const char = i === pos ? <strong key={i}>{text[i]}</strong> : <span key={i}>{text[i]}</span>;
      setChars(chars => [...chars, char]);
    }
  }, [pos]);

  return (
    <Box fontSize="1.6rem">
      {chars.map(c => c)}
    </Box>
  );
}
