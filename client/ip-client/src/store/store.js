import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
