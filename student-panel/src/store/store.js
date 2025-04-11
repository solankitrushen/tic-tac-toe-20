import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import CustomizerReducer from "./customizer/CustomizerSlice";
import TicketReducer from "./tickets/TicketSlice";

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    ticketReducer: TicketReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

const rootReducer = combineReducers({
  customizer: CustomizerReducer,
});
