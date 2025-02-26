import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Booking } from '../../types';

interface BookingsState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

// Fetch bookings for a customer
export const fetchCustomerBookings = createAsyncThunk(
  'bookings/fetchCustomerBookings',
  async (customerId: string, { rejectWithValue }) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('customerId', '==', customerId));
      const bookingsSnapshot = await getDocs(q);
      const bookingsList = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      
      return bookingsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch bookings for a service provider
export const fetchProviderBookings = createAsyncThunk(
  'bookings/fetchProviderBookings',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('providerId', '==', providerId));
      const bookingsSnapshot = await getDocs(q);
      const bookingsList = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      
      return bookingsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch booking by ID
export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      const bookingSnapshot = await getDoc(bookingRef);
      
      if (bookingSnapshot.exists()) {
        return {
          id: bookingSnapshot.id,
          ...bookingSnapshot.data()
        } as Booking;
      } else {
        return rejectWithValue('Booking not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (booking: Omit<Booking, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const newBooking = {
        ...booking,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      
      return {
        id: docRef.id,
        ...newBooking
      } as Booking;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a booking
export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }: { id: string; bookingData: Partial<Booking> }, { rejectWithValue }) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, bookingData);
      
      // Get the updated booking
      const updatedBookingSnapshot = await getDoc(bookingRef);
      
      return {
        id,
        ...updatedBookingSnapshot.data()
      } as Booking;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Cancel a booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: 'cancelled' });
      
      // Get the updated booking
      const updatedBookingSnapshot = await getDoc(bookingRef);
      
      return {
        id,
        ...updatedBookingSnapshot.data()
      } as Booking;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customer bookings
      .addCase(fetchCustomerBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchCustomerBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch provider bookings
      .addCase(fetchProviderBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchProviderBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.currentBooking = action.payload;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.currentBooking = action.payload;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentBooking, clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
