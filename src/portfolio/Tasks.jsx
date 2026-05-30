import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { toast } from "react-toastify";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask
} from "../api/profileService";
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
  const [tagInput, setTagInput] = useState("");

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
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
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
      toast.warning("Title and due date are required.");
      return;
    }

    setOperationLoading(true);
    
    try {
      let response;
      if (editingTask) {
        response = await updateTask(editingTask.id, newTask);
      } else {
        response = await createTask(newTask);
      }
      
      if (response.data?.success) {
        toast.success(editingTask ? "Milestone updated!" : "Milestone created!");
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
        setTagInput("");
        setEditingTask(null);
        setIsModalOpen(false);
        setError(null);
      }
    } catch (err) {
      console.error("Error saving task:", err);
      toast.error(err.response?.data?.message || "Failed to save milestone.");
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
        toast.success("Milestone deleted successfully.");
        await fetchTasks();
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete milestone.");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus === "PENDING" || currentStatus === "IN_PROGRESS") {
        await completeTask(id);
        toast.success("Task completed!");
        await fetchTasks();
      } else if (currentStatus === "COMPLETED") {
        const taskToUpdate = tasks.find(t => t.id === id);
        await updateTask(id, { ...taskToUpdate, status: "PENDING" });
        toast.info("Task reopened.");
        await fetchTasks();
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      toast.error("Failed to update task status");
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-emerald-500 hover:scale-115 transition-transform" />;
      case "IN_PROGRESS":
        return <div className="w-5 h-5 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />;
      case "PENDING":
        return <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-550 transition-colors" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  const addTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask({ ...newTask, tags: [...newTask.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNewTask({ ...newTask, tags: newTask.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Milestones & Projects</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Organize checkpoints, assignments, and goals to build your record.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all cursor-pointer text-white active:scale-95"
              title="Refresh checklist"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-650 flex-shrink-0" />
          <p className="text-xs text-red-700 font-semibold">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-650 hover:text-red-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats Checklist Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Tasks", val: stats.total, color: "text-slate-800", bg: "bg-slate-50 border-slate-100", icon: <Target className="w-5 h-5 text-slate-400" /> },
          { label: "Completed", val: stats.completed, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
          { label: "In Progress", val: stats.inProgress, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: <Clock className="w-5 h-5 text-blue-500" /> },
          { label: "Pending", val: stats.pending, color: "text-amber-500", bg: "bg-amber-50 border-amber-100", icon: <AlertCircle className="w-5 h-5 text-amber-500" /> },
          { label: "Overdue", val: stats.overdue, color: "text-rose-600", bg: "bg-rose-50 border-rose-100", icon: <Flag className="w-5 h-5 text-rose-500" /> }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
              <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bg}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search checklist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Milestones", activeClass: "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/15" },
              { id: "PENDING", label: "Pending", activeClass: "bg-amber-100 text-amber-800 border-amber-200" },
              { id: "HIGH", label: "High Priority", activeClass: "bg-rose-100 text-rose-800 border-rose-200" },
              { id: "ACADEMIC", label: "Academic", activeClass: "bg-blue-100 text-blue-800 border-blue-200" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === btn.id 
                    ? btn.activeClass 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Content List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
            <Loader className="w-8 h-8 text-[#6C63FF] animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Refreshing database feed...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="text-lg font-black text-slate-800">No milestones found</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center">
              {searchTerm || filter !== "all" 
                ? "Try adjusting search queries or selected filter tags."
                : "You're all caught up! Add a new task checkpoint to begin."}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Milestone Checkpoint
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => handleToggleStatus(task.id, task.status)}
                      className="mt-0.5 flex-shrink-0 cursor-pointer"
                      disabled={operationLoading}
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className={`text-sm font-bold leading-tight ${task.status === "COMPLETED" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                            task.priority === "HIGH" ? "bg-rose-50 border-rose-100 text-rose-600" :
                            task.priority === "MEDIUM" ? "bg-amber-50 border-amber-100 text-amber-500" :
                            "bg-emerald-50 border-emerald-100 text-emerald-600"
                          }`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border bg-slate-50 border-slate-100 text-slate-500">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 font-semibold mb-3 leading-relaxed">{task.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-450">
                        <div className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={isOverdue(task.dueDate) && task.status !== "COMPLETED" ? "text-rose-600 font-bold" : ""}>
                            Due: {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate) && task.status !== "COMPLETED" && " (Overdue)"}
                          </span>
                        </div>
                        {task.estimatedTime && (
                          <div className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{task.estimatedTime}</span>
                          </div>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            {task.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-0.5 bg-slate-100/70 border border-slate-150 rounded-lg text-[9px] font-bold text-slate-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => handleEditTask(task)}
                      disabled={operationLoading}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-50 hover:border-indigo-100 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={operationLoading}
                      className="p-2 text-rose-600 hover:bg-rose-50 border border-slate-50 hover:border-rose-100 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      {expandedTask === task.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Details Section */}
                {expandedTask === task.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-slideUp">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[9px]">Timeline Progress</h4>
                        <div className="space-y-2 font-semibold">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Created Date:</span>
                            <span className="text-slate-700">{formatDate(task.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status State:</span>
                            <span className={`font-bold uppercase ${
                              task.status === "COMPLETED" ? "text-emerald-600" :
                              task.status === "IN_PROGRESS" ? "text-blue-600" :
                              "text-amber-500"
                            }`}>
                              {task.status.toLowerCase().replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Progress Tracker:</span>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  task.status === "COMPLETED" ? "bg-emerald-500 w-full" :
                                  task.status === "IN_PROGRESS" ? "bg-blue-500 w-2/3" :
                                  "bg-amber-500 w-1/3"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[9px]">Scope Classification</h4>
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400">
                            {task.category === "ACADEMIC" ? <Book className="w-4 h-4 text-blue-500" /> :
                             task.category === "GROUP" ? <Users className="w-4 h-4 text-indigo-500" /> :
                             <BarChart className="w-4 h-4 text-amber-500" />}
                          </div>
                          <div className="font-semibold">
                            <p className="font-bold text-slate-800 capitalize">{task.category.toLowerCase()}</p>
                            <p className="text-[10px] text-slate-400 leading-normal">
                              {task.category === "ACADEMIC" ? "Assignments & academic deliverables" :
                               task.category === "EXAM" ? "Milestone reviews & exams" :
                               task.category === "GROUP" ? "Collaborations & group projects" :
                               "Other portfolio checklist actions"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[9px]">Checklist Actions</h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleToggleStatus(task.id, task.status)}
                            disabled={operationLoading}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                              task.status === "COMPLETED" 
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                            } disabled:opacity-50`}
                          >
                            {task.status === "COMPLETED" ? "Reopen Milestone" : "Mark Completed"}
                          </button>
                          <button
                            onClick={() => handleEditTask(task)}
                            disabled={operationLoading}
                            className="flex-1 px-3 py-2 bg-indigo-50 border border-indigo-150 text-[#6C63FF] rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer active:scale-95"
                          >
                            Edit Properties
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

      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-150 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-850 tracking-tight">
                  {editingTask ? "Update Checklist Milestone" : "New Milestone Checkpoint"}
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
                    setTagInput("");
                  }}
                  className="text-slate-400 hover:text-slate-650 cursor-pointer"
                  disabled={operationLoading}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddTask} className="p-6 space-y-4 overflow-y-auto flex-1 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Milestone Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400"
                  placeholder="e.g., Complete AWS Practitioner review"
                  disabled={operationLoading}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Scope Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400 resize-none"
                  rows="3"
                  placeholder="Details and objectives of this milestone..."
                  disabled={operationLoading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Priority Tier
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                    disabled={operationLoading}
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                    disabled={operationLoading}
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Exam Review</option>
                    <option value="GROUP">Group Project</option>
                    <option value="RESEARCH">Research</option>
                    <option value="PORTFOLIO">Portfolio Setup</option>
                    <option value="PERSONAL">Personal Goal</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Target Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                    disabled={operationLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Est. Duration
                  </label>
                  <select
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
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

              {/* Tags Section */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Checklist Hashtags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400"
                    placeholder="e.g., theory, aws"
                    disabled={operationLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {newTask.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {newTask.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-bold text-[#6C63FF]">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-rose-600 font-extrabold cursor-pointer text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
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
                    setTagInput("");
                  }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#6C63FF]/25 cursor-pointer disabled:opacity-50"
                  disabled={operationLoading}
                >
                  {operationLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                      {editingTask ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingTask ? "Update Checkpoint" : "Add Checkpoint"
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