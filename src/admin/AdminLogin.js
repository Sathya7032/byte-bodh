import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        alert('Login successful!');
        // In real app, you would redirect or set authentication state
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Login Form */}
          <div className="lg:w-1/2 p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
                  <p className="text-gray-600">Secure access to dashboard</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>

              <div className="text-center text-sm text-gray-500 pt-4">
                <p>Default credentials: admin / admin123</p>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Need help?{' '}
                <a href="/" className="text-blue-600 hover:text-blue-500 font-medium">
                  Contact support
                </a>
              </p>
            </div>
          </div>

          {/* Right side - Admin Illustration */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-12 flex flex-col justify-center items-center relative">
            <div className="relative w-full max-w-md">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-200 rounded-full opacity-20"></div>
              
              {/* Admin illustration */}
              <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 mb-6 relative">
                    {/* Admin avatar/silhouette */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full"></div>
                    <div className="absolute inset-8 bg-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Shield className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Admin Access</h2>
                  <p className="text-gray-600 mb-6">
                    Secure access to your dashboard with advanced analytics, user management, and system controls.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {['Analytics', 'Users', 'Settings'].map((item, index) => (
                      <div key={index} className="bg-white/70 rounded-lg p-3 text-center">
                        <div className="text-blue-600 font-semibold text-sm">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-xs font-medium text-gray-700">Secure Login</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Admin Features</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">SSL Encrypted</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">2FA Ready</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Audit Logs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;