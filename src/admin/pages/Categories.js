import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus, 
  FaSearch, 
  FaCheck, 
  FaTimes,
  FaSpinner,
  FaArrowLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaCalendarAlt
} from 'react-icons/fa';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../api/categories';
import DashboardLayout from '../DashboardLayout';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      // Handle both response formats (with or without data wrapper)
      let categoriesData = [];
      
      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      }
      
      console.log('Fetched categories:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Filter and sort categories
  const getFilteredAndSortedCategories = () => {
    let filtered = categories.filter(category => {
      const matchesSearch = searchTerm === '' || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && category.isActive) ||
        (statusFilter === 'inactive' && !category.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Sort categories
    return filtered.sort((a, b) => {
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
        const dateA = new Date(a[sortConfig.key] || a.createdAt);
        const dateB = new Date(b[sortConfig.key] || b.createdAt);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredCategories = getFilteredAndSortedCategories();

  // Calculate stats locally
  const calculateStats = () => {
    const total = categories.length;
    const active = categories.filter(cat => cat.isActive).length;
    const inactive = total - active;
    const withBlogs = categories.filter(cat => cat.blogs && cat.blogs.length > 0).length;
    
    return { total, active, inactive, withBlogs };
  };

  const stats = calculateStats();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Generate slug from name
  const generateSlug = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a category name first');
      return;
    }
    
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
    setFormData(prev => ({ ...prev, slug }));
    setFormErrors(prev => ({ ...prev, slug: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (formData.description && formData.description.length > 300) {
      errors.description = 'Description must be less than 300 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setFormLoading(true);
      
      if (editingCategory) {
        // Update existing category
        const response = await updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
        
        // Update local state
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? response.data : cat
        ));
      } else {
        // Create new category
        const response = await createCategory(formData);
        toast.success('Category created successfully');
        
        // Add to local state
        setCategories([...categories, response.data]);
      }
      
      // Reset form and close
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      
      if (error.response?.status === 400 || error.response?.status === 409) {
        const errorData = error.response.data;
        if (errorData.message?.toLowerCase().includes('slug') || errorData.message?.toLowerCase().includes('unique')) {
          setFormErrors(prev => ({ ...prev, slug: 'Slug already exists' }));
          toast.error('This slug is already taken. Please use a different one.');
        } else if (errorData.message?.toLowerCase().includes('name')) {
          setFormErrors(prev => ({ ...prev, name: 'Category name already exists' }));
          toast.error('A category with this name already exists.');
        } else {
          toast.error(errorData.message || 'Failed to save category');
        }
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else {
        toast.error('Failed to save category. Please try again.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      isActive: true
    });
    setFormErrors({});
    setEditingCategory(null);
    setViewingCategory(null);
    setShowForm(false);
    setSelectedCategory(null);
  };

  // Handle edit category
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setEditingCategory(category);
    setShowForm(true);
    setViewingCategory(null);
    setSelectedCategory(category);
    
    // Scroll to form on mobile
    if (window.innerWidth < 1024) {
      const formElement = document.querySelector('.form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle delete category
  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategory(category.id);
      
      // Remove from local state
      setCategories(categories.filter(c => c.id !== category.id));
      toast.success('Category deleted successfully');
      
      // If we were viewing/editing this category, reset form
      if (selectedCategory?.id === category.id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      
      if (error.response?.status === 400) {
        toast.error('Cannot delete category that has associated blogs');
      } else if (error.response?.status === 404) {
        toast.error('Category not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to delete categories');
      } else {
        toast.error('Failed to delete category');
      }
    }
  };

  // Handle view category details
  const handleView = async (category) => {
    try {
      // Try to fetch fresh data first
      const response = await getCategoryById(category.id);
      const freshCategory = response.data;
      
      setViewingCategory(freshCategory);
      setShowForm(false);
      setEditingCategory(null);
      setSelectedCategory(freshCategory);
    } catch (error) {
      console.error('Error fetching category details:', error);
      // Fallback to local data if API fails
      setViewingCategory(category);
      setShowForm(false);
      setEditingCategory(null);
      setSelectedCategory(category);
    }
    
    // Scroll to view on mobile
    if (window.innerWidth < 1024) {
      const formElement = document.querySelector('.form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Toggle category active status (local update)
  const toggleActiveStatus = async (category) => {
    try {
      const updatedCategory = { 
        ...category, 
        isActive: !category.isActive 
      };
      
      const response = await updateCategory(category.id, updatedCategory);
      
      // Update local state with response data
      setCategories(categories.map(c => 
        c.id === category.id ? response.data : c
      ));
      
      // Update viewing/editing category if selected
      if (selectedCategory?.id === category.id) {
        if (viewingCategory) setViewingCategory(response.data);
        if (editingCategory) setEditingCategory(response.data);
        setSelectedCategory(response.data);
      }
      
      toast.success(`Category ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Failed to update category status');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading && !showForm && !viewingCategory && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout pageTitle="Categories">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Blog Categories
              </h1>
              <p className="text-gray-600">
                Manage your blog categories. Create, edit, and organize categories for your blog posts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 flex items-center gap-2"
              >
                <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                <FaPlus />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{stats.inactive}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <FaTimes className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Blogs</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">{stats.withBlogs}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaFilter className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Categories List */}
          <div className={`lg:col-span-2 ${showForm || viewingCategory ? 'hidden lg:block' : ''}`}>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  <div className="text-sm text-gray-600">
                    {filteredCategories.length} of {categories.length} categories
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {getSortIcon('name')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="mr-1" />
                          Created
                          {getSortIcon('createdAt')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map(category => (
                      <tr 
                        key={category.id} 
                        className={`hover:bg-gray-50 ${selectedCategory?.id === category.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {category.name}
                            </div>
                            {category.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            /{category.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleActiveStatus(category)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
                              category.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {category.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(category.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(category)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(category)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredCategories.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FaSearch className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {categories.length === 0 ? 'No categories found' : 'No matching categories'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {categories.length === 0 
                        ? 'Get started by creating your first category' 
                        : 'Try adjusting your search or filters'}
                    </p>
                    {categories.length === 0 && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center gap-2 font-medium"
                      >
                        <FaPlus />
                        Create Your First Category
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Form/View */}
          <div className={`form-container ${!showForm && !viewingCategory ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
              {/* Header */}
              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {viewingCategory ? 'Category Details' : editingCategory ? 'Edit Category' : 'New Category'}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {viewingCategory ? 'View category information' : editingCategory ? 'Update category details' : 'Add a new category to organize your blogs'}
                    </p>
                  </div>
                  {(showForm || viewingCategory) && (
                    <button
                      onClick={resetForm}
                      className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                      title="Close"
                    >
                      <FaArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {viewingCategory ? (
                  // View Mode
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-gray-800 font-medium">{viewingCategory.name}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-gray-800 font-mono text-sm">/{viewingCategory.slug}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[100px]">
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {viewingCategory.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            viewingCategory.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {viewingCategory.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => toggleActiveStatus(viewingCategory)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                              viewingCategory.isActive 
                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {viewingCategory.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Created
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-gray-600 text-sm">
                            {formatDate(viewingCategory.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {viewingCategory.blogs && viewingCategory.blogs.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Associated Blogs
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-gray-600 mb-2">
                            {viewingCategory.blogs.length} blog(s) in this category
                          </p>
                          <ul className="space-y-1">
                            {viewingCategory.blogs.slice(0, 5).map(blog => (
                              <li key={blog.id} className="text-sm text-gray-500 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                <span className="truncate">{blog.title}</span>
                              </li>
                            ))}
                            {viewingCategory.blogs.length > 5 && (
                              <li className="text-sm text-gray-400">
                                ...and {viewingCategory.blogs.length - 5} more
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(viewingCategory)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium"
                        >
                          Edit Category
                        </button>
                        <button
                          onClick={resetForm}
                          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Form Mode
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Technology, Lifestyle, Business"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Slug *
                        </label>
                        <button
                          type="button"
                          onClick={generateSlug}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          disabled={!formData.name.trim()}
                        >
                          Generate from name
                        </button>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 text-gray-500">
                          /
                        </span>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.slug ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="technology"
                        />
                      </div>
                      {formErrors.slug && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        URL-friendly version. Use lowercase letters, numbers, and hyphens only.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                          formErrors.description ? 'border-red-500' : ''
                        }`}
                        placeholder="Describe what this category is about..."
                        maxLength="300"
                      />
                      {formErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                      )}
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {formData.description.length}/300 characters
                        </p>
                        <p className="text-xs text-gray-500">
                          Optional
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Make category active
                      </label>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={formLoading}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-150 font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {formLoading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              {editingCategory ? 'Updating...' : 'Creating...'}
                            </>
                          ) : editingCategory ? (
                            <>
                              <FaCheck />
                              Update Category
                            </>
                          ) : (
                            <>
                              <FaPlus />
                              Create Category
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          disabled={formLoading}
                          className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
    </DashboardLayout>
  );
};

export default Categories;