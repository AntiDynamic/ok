import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  providerId: string;
  providerName: string;
  rating: number;
  reviews: number;
  image?: string;
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  isLoading: false,
  error: null,
};

// TODO: Replace with actual API call
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    // Simulated API call
    const mockServices: Service[] = [
      {
        id: '1',
        title: 'Professional Web Development',
        description: 'Full-stack web development services with modern technologies',
        price: 500,
        category: 'development',
        providerId: 'user1',
        providerName: 'John Doe',
        rating: 4.8,
        reviews: 25,
      },
      {
        id: '2',
        title: 'Logo Design',
        description: 'Creative and professional logo design services',
        price: 200,
        category: 'design',
        providerId: 'user2',
        providerName: 'Jane Smith',
        rating: 4.9,
        reviews: 18,
      },
    ];

    return mockServices;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch services';
      });
  },
});

export default servicesSlice.reducer;
