import { Box } from "@chakra-ui/react"
import { useCallback, useEffect } from "react";

export const App = () => {
  return (
    <Box>
      <SushiModal />
    </Box>
  )
}

const SushiModal = () => {
  const handleKeyDown = useCallback((event) => {
    console.log(event.key);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box>
      shshi
    </Box>
  )
}
