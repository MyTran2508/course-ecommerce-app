"use client";
import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { persistor } from "./store";

import { PersistGate } from "redux-persist/integration/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}
