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
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState(0);
  const [inputValueList, setInputValueList] = useState<string[]>([]);

  const handleKeyDown = useCallback((event) => {
    if (TEXT[pos] === event.key) {
      setPos(p => p + 1);
    }
  }, [pos]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pos]);

  return (
    <Box>
      {pos}<br />
    </Box>
  )
}
