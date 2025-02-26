import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import servicesReducer from './services/servicesSlice';
import bookingsReducer from './bookings/bookingsSlice';
import chatReducer from './chat/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    bookings: bookingsReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
