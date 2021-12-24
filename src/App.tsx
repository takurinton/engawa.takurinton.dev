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

  const handleKeyDown = useCallback((event) => {
    if (!playing) {
      if ('Enter' === event.key) {
        console.log('start play');
        setPlaying(true);
        // start();
      }
    } else {
      // TODO: ストップとフィニッシュにはそれぞれ別のステートを設けたい
      if (count >= 10) {
        console.log('finish');
        setPlaying(false);
        // stop();
      }
      if ('Escape' === event.key) {
        console.log('stop');
        setPlaying(false);
        stop();
      }
      if (pos < len - 1) {
        if (TEXT[pos] === event.key) {
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

  console.log('render');
  return (
    <Box>
      {playing ? 'プレイちゅう' : 'すとっぷ'}<br />
      <MarkCurrentText text={TEXT} pos={pos} />
      <Counter count={count} />
      <Timer playing={playing} />
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
}: {
  playing: boolean;
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
    console.log(chars)
    for (let i = 0; i < text.length; i++) {
      const char = i === pos ? <strong key={i}>{text[i]}</strong> : <span key={i}>{text[i]}</span>;
      setChars(chars => [...chars, char]);
    }
  }, [pos]);

  return (
    <Box fontSize="1.6rem">
      {console.log(chars)}
      {chars.map(c => c)}
    </Box>
  );
}
