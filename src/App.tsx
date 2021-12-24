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

const SushiModal = () => {
  const TEXT = 'takurinton';
  const len = TEXT.length;
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reset, setReset] = useState(false);

  const handleKeyDown = useCallback((event) => {
    if (!playing) {
      if ('Enter' === event.key) {
        console.log('start play');
        setReset(false);
        setPlaying(true);
      }
      if ('Escape' === event.key) {
        console.log('reset');
        setCount(0);
        setPos(0);
        setReset(true);
      }
    } else {
      if ('Escape' === event.key) {
        console.log('stop');
        setPlaying(false);
      }
      if (pos < len - 1) {
        if (TEXT[pos] === event.key) {
          if (count === 9 && pos === len - 2) {
            // finish
            setPlaying(false);
            setCount(c => c + 1);
          }
          setPos(p => p + 1);
        }
      } else if (TEXT[len-1] === event.key) { // 最後の1文字
        setPos(0);
        setCount(c => c + 1);
      }
    }
  }, [pos, count, playing]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pos, count, playing]);


  return (
    <Box>
      {playing ? 'プレイちゅう' : 'すとっぷ'}<br />
      <MarkCurrentText text={TEXT} pos={pos} />
      <Counter count={count} />
      <Timer playing={playing} reset={reset} />
    </Box>
  );
}

const Counter = ({
  count,
}: {
  count: number;
}) => {
  return <chakra.p>{count}</chakra.p>
}

const Timer = ({
  playing,
  reset,
}: {
  playing: boolean;
  reset: boolean;
}) => {
  const [timerId, setTimerId] = useState(null as any);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (playing) {
      clearInterval(timerId);
      let timer = setInterval(() => {
        setTime(t => t + 100);
      }, 100);
      setTimerId(timer);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [playing]);

  useEffect(() => {
    if (reset) setTime(0);
  }, [reset]);

  return (
    <Box>
      {`${time/1000}${(time / 1000) % 1 === 0 ? '.0' : ''}`}
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
