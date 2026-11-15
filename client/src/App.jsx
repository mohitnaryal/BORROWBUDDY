import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import ItemDetails from './pages/ItemDetails';
import AddEditItem from './pages/AddEditItem';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Pages */}
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="items/:id" element={<ItemDetails />} />
            <Route path="users/:id" element={<UserProfile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="items/add"
              element={
                <ProtectedRoute>
                  <AddEditItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="items/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
