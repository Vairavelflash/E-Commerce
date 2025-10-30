import { useState, useCallback } from "react";

// Very small optimistic helper: apply optimistic update function, returns rollback
export default function useOptimistic(initial) {
  const [state, setState] = useState(initial);

  const applyOptimistic = useCallback(
    (optimisticUpdater) => {
      const prev = state;
      const next =
        typeof optimisticUpdater === "function"
          ? optimisticUpdater(prev)
          : optimisticUpdater;
      setState(next);
      const rollback = () => setState(prev);
      return rollback;
    },
    [state]
  );

  return [state, setState, applyOptimistic];
}
