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

  const handleKeyDown = useCallback((event) => {
    if (pos < len - 1) {
      // なんか処理入れるかも
      if (TEXT[pos] === event.key) {
        setPos(p => p + 1);
      }
    } else if (TEXT[len-1] === event.key) { // 最後の1文字
      setPos(0);
      setCount(c => c + 1);
    }
  }, [pos]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pos]);

  return (
    <Box>
      {pos}<br />
      {count}
    </Box>
  )
}
