import { useCallback, useEffect, useState } from "react";

const useDisableClicking = () => {
  const [isMutating, setIsMutating] = useState(false);
  const handleSetMutatingState =setIsMutating
  useEffect(() => {
    
    if (isMutating) {
      document.body.style.pointerEvents = "none";
      return () => {
        document.body.style.pointerEvents = "auto";
      };
    }
    if (!isMutating) {
        document.body.style.pointerEvents = "auto";
      }
  }, [isMutating]);

  return { handleSetMutatingState };
};
export default useDisableClicking;
