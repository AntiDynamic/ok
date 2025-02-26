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
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { Service } from '../../types';

interface ServicesState {
  services: Service[];
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  isLoading: false,
  error: null,
};

// Fetch all services
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const servicesRef = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesRef);
      const servicesList = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      return servicesList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch services by category
export const fetchServicesByCategory = createAsyncThunk(
  'services/fetchServicesByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('category', '==', category));
      const servicesSnapshot = await getDocs(q);
      const servicesList = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      return servicesList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch service by ID
export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const serviceRef = doc(db, 'services', id);
      const serviceSnapshot = await getDoc(serviceRef);
      
      if (serviceSnapshot.exists()) {
        return {
          id: serviceSnapshot.id,
          ...serviceSnapshot.data()
        } as Service;
      } else {
        return rejectWithValue('Service not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new service
export const createService = createAsyncThunk(
  'services/createService',
  async ({ service, imageFile }: { 
    service: Omit<Service, 'id' | 'imageUrl' | 'createdAt'>;
    imageFile: File;
  }, { rejectWithValue }) => {
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `services/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      
      // Create service in Firestore
      const newService = {
        ...service,
        imageUrl,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'services'), newService);
      
      return {
        id: docRef.id,
        ...newService
      } as Service;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a service
export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, serviceData, imageFile }: { 
    id: string;
    serviceData: Partial<Service>;
    imageFile?: File;
  }, { rejectWithValue }) => {
    try {
      let updatedData = { ...serviceData };
      
      // If there's a new image, upload it
      if (imageFile) {
        const storageRef = ref(storage, `services/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        updatedData.imageUrl = imageUrl;
      }
      
      // Update service in Firestore
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, updatedData);
      
      // Get the updated service
      const updatedServiceSnapshot = await getDoc(serviceRef);
      
      return {
        id,
        ...updatedServiceSnapshot.data()
      } as Service;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a service
export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: string, { rejectWithValue }) => {
    try {
      const serviceRef = doc(db, 'services', id);
      await deleteDoc(serviceRef);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch services by category
      .addCase(fetchServicesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServicesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.push(action.payload);
        state.currentService = action.payload;
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.services.findIndex(service => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        state.currentService = action.payload;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = state.services.filter(service => service.id !== action.payload);
        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentService, clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
