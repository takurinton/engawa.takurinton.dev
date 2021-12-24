import { Box } from "@chakra-ui/react"
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
  const [timerId, setTimerId] = useState(null as any);
  const [time, setTime] = useState(0);

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
    if (playing) {
      clearInterval(timerId);
      let timer = setInterval(() => {
        setTime(t => t + 100);
      }, 100);
      setTimerId(timer);
    } else {
      clearInterval(timerId);
      // setTime(0);
      // setCount(0);
      // setPos(0);
    }

    return () => clearInterval(timerId);
  }, [playing])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pos, count, playing]);

  return (
    <Box>
      {playing ? 'プレイちゅう' : 'すとっぷ'}<br />
      {pos}<br />
      {count}<br />
      {`${time/1000}${(time / 1000) % 1 === 0 ? '.0' : ''}`}
    </Box>
  )
}
