import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { RootState } from "..";

const saveStoreMiddleware = createListenerMiddleware();
saveStoreMiddleware.startListening.withTypes<RootState>()({
  // matcher: isAnyOf(markCaseCorrect, markCaseIncorrect),
  predicate(_action, currentState, originalState) {
    return currentState.weights.data != originalState.weights.data;
  },
  effect: (_, api) => {
    console.log(api.getState().weights.data);
    localStorage.setItem(
      "weights",
      JSON.stringify(api.getState().weights.data),
    );
  },
});

export default saveStoreMiddleware;
