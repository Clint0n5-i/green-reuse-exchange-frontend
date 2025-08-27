// App.jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseItems from './pages/BrowseItems';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostItem from './pages/PostItem';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/browse" element={<BrowseItems />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="/post-item"
                        element={
                            <ProtectedRoute>
                                <PostItem />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminProtectedRoute>
                                <Dashboard />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </div>
        </AuthProvider>
    );
}
export default App;