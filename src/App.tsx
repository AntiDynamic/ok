import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Provider } from 'react-redux';
import { store } from './store';

// Auth
import { auth, db } from './services/firebase';
import { setUser } from './features/auth/authSlice';
import { RootState } from './features/store';
import { User } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceListing from './pages/ServiceListing';
import ServiceDetails from './pages/ServiceDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';
import Bookings from './pages/Bookings';
import BookingDetails from './pages/BookingDetails';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          dispatch(setUser(userDoc.data() as User));
        } else {
          // If user exists in Firebase Auth but not in Firestore
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
              <Route path="/services" element={<ServiceListing />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/services/create" element={
                <ProtectedRoute>
                  <CreateService />
                </ProtectedRoute>
              } />
              <Route path="/services/edit/:id" element={
                <ProtectedRoute>
                  <EditService />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } />
              <Route path="/bookings/:id" element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/chat/:id" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
