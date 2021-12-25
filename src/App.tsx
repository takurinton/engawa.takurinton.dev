import { 
  Box, 
  Button,
  UnorderedList,
  ListItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useCallback, useEffect, useState } from "react";

export const App = () => {
  return (
    <Box
      m="10% auto"
      p="50px"
      h="300px"
      w="50%"
      textAlign="center"
      backgroundColor="white"
      borderRadius="20px"
      boxShadow="2px 2px 4px"
    >
      <Sushi />
    </Box>
  )
}

type GameState = 'ready' | 'playing' | 'finish' | 'stop';

const Sushi = () => {
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box h="100%">
      <chakra.p>よーい</chakra.p>
      <chakra.p>（Enterを押してスタート）</chakra.p>

      <Button onClick={onOpen} m="30px 0">あそびかた</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>あそびかた</ModalHeader>
        <ModalCloseButton />
        
          <Box textAlign="left" w="60%" m="20px auto">
            <UnorderedList>
              <ListItem>Enterを押すとゲームが始まります</ListItem>
              <ListItem>`takurinton` を<strong>10回</strong>入力する速さを競うゲームです</ListItem>
              <ListItem>ゲームの途中、または終了後にEscキーを押すと最初に戻ります、何度でも挑戦することができます。</ListItem>
              <ListItem>
                自動で入力したプログラムは不正とみなします！
                <UnorderedList>
                  <ListItem>不正かどうかの基準は、一旦記録が5秒以内かで判断します。そのうち変えるかもしれません。</ListItem>
                  <ListItem>人力で5秒以内を達成した人は <a href="https://twitter.com/takurinton" style={{ color: '#ff69b4' }}>@takurinton</a> まで連絡をください。称賛します。</ListItem>
                </UnorderedList>
              </ListItem>
            </UnorderedList>
          </Box>
          <ModalFooter>
            <Button onClick={onClose}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      <Button colorScheme="twitter" m="10px"><a target="_blank" rel="noopener" href="https://twitter.com/?share=">tweet</a></Button>
      <chakra.p>Esc を押して再チャレンジ！</chakra.p>
    </Box>
  )
}

const Counter = ({
  count,
}: {
  count: number;
}) => {
  return <chakra.p>{count}回</chakra.p>
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
      const char = i === pos ? <strong key={i} style={{ fontSize: '2rem'}}>{text[i]}</strong> : <span key={i} style={{ fontSize: '1.6rem'}}>{text[i]}</span>;
      setChars(chars => [...chars, char]);
    }
  }, [pos]);

  return (
    <Box>
      {chars.map(c => c)}
    </Box>
  );
}
