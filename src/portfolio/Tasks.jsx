import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask
} from "../api/profileService"; // Import your API service
import {
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Flag,
  Book,
  Target,
  Users,
  BarChart,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Loader,
  AlertTriangle
} from "lucide-react";

const Tasks = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    estimatedTime: "",
    category: "ACADEMIC",
    tags: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks();
      
      if (response.data?.success) {
        setTasks(response.data.data || []);
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "COMPLETED").length,
    pending: tasks.filter(task => task.status === "PENDING").length,
    inProgress: tasks.filter(task => task.status === "IN_PROGRESS").length,
    overdue: tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== "COMPLETED";
    }).length,
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === "all" || 
      task.status === filter ||
      task.priority === filter ||
      task.category === filter;
    
    const matchesSearch = 
      searchTerm === "" ||
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesFilter && matchesSearch;
  });

  // Handle task creation
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newTask.title.trim() || !newTask.dueDate) {
      setError("Title and due date are required");
      return;
    }

    setOperationLoading(true);
    
    try {
      let response;
      
      if (editingTask) {
        // Update existing task
        response = await updateTask(editingTask.id, newTask);
      } else {
        // Create new task
        response = await createTask(newTask);
      }
      
      if (response.data?.success) {
        // Refresh task list
        await fetchTasks();
        
        // Reset form and close modal
        setNewTask({
          title: "",
          description: "",
          priority: "MEDIUM",
          dueDate: "",
          estimatedTime: "",
          category: "ACADEMIC",
          tags: []
        });
        setEditingTask(null);
        setIsModalOpen(false);
        setError(null);
      }
    } catch (err) {
      console.error("Error saving task:", err);
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle task edit
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate?.split('T')[0] || "",
      estimatedTime: task.estimatedTime || "",
      category: task.category,
      tags: task.tags || []
    });
    setIsModalOpen(true);
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const response = await deleteTask(id);
      
      if (response.data?.success) {
        await fetchTasks(); // Refresh list
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus === "PENDING" || currentStatus === "IN_PROGRESS") {
        // Mark as completed
        await completeTask(id);
        await fetchTasks();
      } else if (currentStatus === "COMPLETED") {
        // Reopen task (set to pending)
        const taskToUpdate = tasks.find(t => t.id === id);
        await updateTask(id, { ...taskToUpdate, status: "PENDING" });
        await fetchTasks();
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status");
    }
  };

  

  const getStatusIcon = (status) => {
    switch(status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "IN_PROGRESS":
        return <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin" />;
      case "PENDING":
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  // Loading state
  if (loading && tasks.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  Task Manager
                </h1>
                <p className="text-gray-600 mt-2">
                  Organize, track, and complete your academic tasks efficiently
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchTasks}
                  disabled={loading}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh tasks"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New Task
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Overdue</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Flag className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tasks by title, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setFilter("PENDING")}
                  className={`px-4 py-2 rounded-lg transition-colors ${filter === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("HIGH")}
                  className={`px-4 py-2 rounded-lg transition-colors ${filter === "HIGH" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  High Priority
                </button>
                <button
                  onClick={() => setFilter("ACADEMIC")}
                  className={`px-4 py-2 rounded-lg transition-colors ${filter === "ACADEMIC" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Academic
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Loader className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "You're all caught up! Add a new task to get started"}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Task
                  </button>
                </div>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          onClick={() => handleToggleStatus(task.id, task.status)}
                          className="mt-1 flex-shrink-0"
                          disabled={operationLoading}
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold ${task.status === "COMPLETED" ? "text-gray-500 line-through" : "text-gray-900"}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === "HIGH" ? "bg-red-100 text-red-800" :
                                task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {task.priority.toLowerCase()} priority
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.category === "ACADEMIC" ? "bg-blue-100 text-blue-800" :
                                task.category === "EXAM" ? "bg-purple-100 text-purple-800" :
                                task.category === "GROUP" ? "bg-indigo-100 text-indigo-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {task.category.toLowerCase()}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{task.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span className={isOverdue(task.dueDate) && task.status !== "COMPLETED" ? "text-red-600 font-medium" : ""}>
                                Due: {formatDate(task.dueDate)}
                                {isOverdue(task.dueDate) && task.status !== "COMPLETED" && " (Overdue)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{task.estimatedTime || "No time estimate"}</span>
                            </div>
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                {task.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditTask(task)}
                          disabled={operationLoading}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={operationLoading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedTask === task.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {expandedTask === task.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Task Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Created:</span>
                                <span className="font-medium">{formatDate(task.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-medium ${
                                  task.status === "COMPLETED" ? "text-green-600" :
                                  task.status === "IN_PROGRESS" ? "text-blue-600" :
                                  "text-yellow-600"
                                }`}>
                                  {task.status.toLowerCase().replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Progress:</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-full rounded-full ${
                                      task.status === "COMPLETED" ? "bg-green-500 w-full" :
                                      task.status === "IN_PROGRESS" ? "bg-blue-500 w-2/3" :
                                      "bg-yellow-500 w-1/3"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${
                                task.category === "ACADEMIC" ? "bg-blue-50" :
                                task.category === "EXAM" ? "bg-purple-50" :
                                task.category === "GROUP" ? "bg-indigo-50" :
                                "bg-gray-50"
                              }`}>
                                {task.category === "ACADEMIC" ? <Book className="w-5 h-5 text-blue-600" /> :
                                 task.category === "GROUP" ? <Users className="w-5 h-5 text-indigo-600" /> :
                                 <BarChart className="w-5 h-5 text-purple-600" />}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{task.category.toLowerCase()}</p>
                                <p className="text-sm text-gray-600">
                                  {task.category === "ACADEMIC" ? "Academic assignments and coursework" :
                                   task.category === "EXAM" ? "Exam preparation and study" :
                                   task.category === "GROUP" ? "Group projects and collaboration" :
                                   "Other academic activities"}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                            <div className="space-y-2">
                              <button
                                onClick={() => handleToggleStatus(task.id, task.status)}
                                disabled={operationLoading}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  task.status === "COMPLETED" 
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                } disabled:opacity-50`}
                              >
                                {task.status === "COMPLETED" ? "Reopen Task" : "Mark as Complete"}
                              </button>
                              <button
                                onClick={() => handleEditTask(task)}
                                disabled={operationLoading}
                                className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                              >
                                Edit Task Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                    setNewTask({
                      title: "",
                      description: "",
                      priority: "MEDIUM",
                      dueDate: "",
                      estimatedTime: "",
                      category: "ACADEMIC",
                      tags: []
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={operationLoading}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Complete Math Assignment"
                  disabled={operationLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add details about the task..."
                  disabled={operationLoading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={operationLoading}
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={operationLoading}
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Exam</option>
                    <option value="GROUP">Group Project</option>
                    <option value="RESEARCH">Research</option>
                    <option value="PORTFOLIO">Portfolio</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={operationLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <select
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={operationLoading}
                  >
                    <option value="">Select duration</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="5+ hours">5+ hours</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                    setNewTask({
                      title: "",
                      description: "",
                      priority: "MEDIUM",
                      dueDate: "",
                      estimatedTime: "",
                      category: "ACADEMIC",
                      tags: []
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  disabled={operationLoading}
                >
                  {operationLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      {editingTask ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingTask ? "Update Task" : "Add Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tasks;