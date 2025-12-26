"use client";

import { Provider, useSelector } from "react-redux";
import { makeStore } from "@/lib/store";
import { useState } from "react";
import { Toaster } from "sonner";
import OverLaySpinner from "@/components/common/OverLaySpinner";

export default function StoreProvider({ children }) {
  const [store] = useState(() => makeStore());

  if (!store) return null;

  return (
    <Provider store={store}>
      <OverLaySpinner/>
      <Toaster />
      {children}
    </Provider>
  );
}
