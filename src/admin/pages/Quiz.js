import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Edit, Trophy, Clock, Calendar, AlertCircle, Search, Filter, X } from 'lucide-react';
import axios from '../../api/axios';
import DashboardLayout from '../DashboardLayout';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editQuizId, setEditQuizId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryName: '',
    difficulty: 'Easy',
    timeLimitMinutes: 10,
    expiryDate: '',
    prizes: [
      { position: 1, prizeAmount: '', prizeDetails: '' },
      { position: 2, prizeAmount: '', prizeDetails: '' },
      { position: 3, prizeAmount: '', prizeDetails: '' }
    ],
    questions: [
      {
        questionText: '',
        marks: 5,
        options: [
          { optionText: '', correct: false },
          { optionText: '', correct: false },
          { optionText: '', correct: false },
          { optionText: '', correct: false }
        ]
      }
    ]
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/quizzes');
      const data = response.data.data;
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
      // Only show alert if it's not a 404 or empty response
      if (error.response?.status !== 404) {
        alert('Failed to fetch quizzes: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/quizzes', formData);
      console.log('Quiz created:', response.data);
      alert('Quiz created successfully!');
      setShowCreateModal(false);
      fetchQuizzes();
      resetForm();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/quizzes/${editQuizId}`, formData);
      console.log('Quiz updated:', response.data);
      alert('Quiz updated successfully!');
      setShowCreateModal(false);
      setIsEditMode(false);
      setEditQuizId(null);
      fetchQuizzes();
      resetForm();
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditQuiz = async (quiz) => {
    try {
      const response = await axios.get(`/quizzes/${quiz.id}`);
      const quizData = response.data.data;
      
      // Format expiry date for datetime-local input
      const expiryDate = quizData.expiryDate ? new Date(quizData.expiryDate).toISOString().slice(0, 16) : '';
      
      setFormData({
        title: quizData.title || '',
        description: quizData.description || '',
        categoryName: quizData.categoryName || '',
        difficulty: quizData.difficulty || 'Easy',
        timeLimitMinutes: quizData.timeLimitMinutes || 10,
        expiryDate: expiryDate,
        prizes: quizData.prizes && quizData.prizes.length > 0 ? quizData.prizes : [
          { position: 1, prizeAmount: '', prizeDetails: '' },
          { position: 2, prizeAmount: '', prizeDetails: '' },
          { position: 3, prizeAmount: '', prizeDetails: '' }
        ],
        questions: quizData.questions && quizData.questions.length > 0 ? quizData.questions : [
          {
            questionText: '',
            marks: 5,
            options: [
              { optionText: '', correct: false },
              { optionText: '', correct: false },
              { optionText: '', correct: false },
              { optionText: '', correct: false }
            ]
          }
        ]
      });
      setIsEditMode(true);
      setEditQuizId(quiz.id);
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error loading quiz for edit:', error);
      alert('Failed to load quiz data');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`/quizzes/${id}`);
        alert('Quiz deleted successfully!');
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
      }
    }
  };

  const viewQuizDetails = async (id) => {
    try {
      const response = await axios.get(`/quizzes/${id}`);
      setSelectedQuiz(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      alert('Failed to fetch quiz details');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryName: '',
      difficulty: 'Easy',
      timeLimitMinutes: 10,
      expiryDate: '',
      prizes: [
        { position: 1, prizeAmount: '', prizeDetails: '' },
        { position: 2, prizeAmount: '', prizeDetails: '' },
        { position: 3, prizeAmount: '', prizeDetails: '' }
      ],
      questions: [
        {
          questionText: '',
          marks: 5,
          options: [
            { optionText: '', correct: false },
            { optionText: '', correct: false },
            { optionText: '', correct: false },
            { optionText: '', correct: false }
          ]
        }
      ]
    });
    setIsEditMode(false);
    setEditQuizId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    setFormData(prev => ({ ...prev, prizes: newPrizes }));
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex][field] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'correct' && value === true) {
      // Uncheck all other options
      newQuestions[qIndex].options.forEach((opt, i) => {
        opt.correct = i === oIndex;
      });
    } else {
      newQuestions[qIndex].options[oIndex][field] = value;
    }
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          marks: 5,
          options: [
            { optionText: '', correct: false },
            { optionText: '', correct: false },
            { optionText: '', correct: false },
            { optionText: '', correct: false }
          ]
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || quiz.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <DashboardLayout pageTitle="Quiz Management">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Management</h1>
          <p className="text-gray-600">Create and manage quizzes with prizes and questions</p>
        </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            Create Quiz
          </button>
        </div>
      </div>

      {/* Quiz List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {quizzes.length === 0 ? 'No Quizzes Found' : 'No Matching Quizzes'}
          </h3>
          <p className="text-gray-500 mb-6">
            {quizzes.length === 0 
              ? 'Get started by creating your first quiz' 
              : 'Try adjusting your search or filter criteria'}
          </p>
          {quizzes.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="text-blue-50 text-sm">{quiz.categoryName}</p>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-blue-500" />
                    <span>{quiz.timeLimitMinutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-blue-500" />
                    <span>Expires: {new Date(quiz.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy size={16} className="text-yellow-500" />
                    <span>{quiz.prizes?.length || 0} Prizes</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => viewQuizDetails(quiz.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleEditQuiz(quiz)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Quiz' : 'Create New Quiz'}</h2>
            </div>

            <form onSubmit={isEditMode ? handleUpdateQuiz : handleCreateQuiz} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Basic Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Spring Boot Mastery"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Test your Spring Boot fundamentals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Spring Boot"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes) *</label>
                    <input
                      type="number"
                      name="timeLimitMinutes"
                      value={formData.timeLimitMinutes}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      type="datetime-local"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Prizes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  Prizes
                </h3>
                <div className="space-y-4">
                  {formData.prizes.map((prize, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <input
                          type="number"
                          value={prize.position}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prize Amount</label>
                        <input
                          type="text"
                          value={prize.prizeAmount}
                          onChange={(e) => handlePrizeChange(index, 'prizeAmount', e.target.value)}
                          placeholder="e.g., ₹1000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prize Details</label>
                        <input
                          type="text"
                          value={prize.prizeDetails}
                          onChange={(e) => handlePrizeChange(index, 'prizeDetails', e.target.value)}
                          placeholder="e.g., Amazon Gift Card"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">Question {qIndex + 1}</h4>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                          <textarea
                            value={question.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                            required
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your question"
                          />
                        </div>

                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Marks *</label>
                          <input
                            type="number"
                            value={question.marks}
                            onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))}
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={option.correct}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, 'correct', e.target.checked)}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <input
                                  type="text"
                                  value={option.optionText}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionText', e.target.value)}
                                  required
                                  placeholder={`Option ${oIndex + 1}`}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {option.correct ? '✓ Correct' : 'Mark as correct'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditMode ? 'Update Quiz' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Detail Modal */}
      {showDetailModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedQuiz.title}</h2>
                  <p className="text-blue-50">{selectedQuiz.categoryName}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Quiz Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quiz Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-gray-700"><strong>Description:</strong> {selectedQuiz.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-gray-700"><strong>Difficulty:</strong> <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(selectedQuiz.difficulty)}`}>{selectedQuiz.difficulty}</span></p>
                    <p className="text-gray-700"><strong>Time Limit:</strong> {selectedQuiz.timeLimitMinutes} minutes</p>
                    <p className="text-gray-700"><strong>Expiry Date:</strong> {new Date(selectedQuiz.expiryDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Prizes */}
              {selectedQuiz.prizes && selectedQuiz.prizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} />
                    Prizes
                  </h3>
                  <div className="space-y-2">
                    {selectedQuiz.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="font-semibold text-gray-800">Position {prize.position}</span>
                        <span className="text-gray-700">{prize.prizeAmount} - {prize.prizeDetails}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Questions ({selectedQuiz.questions.length})</h3>
                  <div className="space-y-4">
                    {selectedQuiz.questions.map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-300 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800">Question {qIndex + 1}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                            {question.marks} marks
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{question.questionText}</p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Options:</p>
                          {question.options && question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`p-3 rounded-lg ${
                                option.correct
                                  ? 'bg-green-50 border border-green-300'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {option.correct && <span className="text-green-600 font-bold">✓</span>}
                                <span className={option.correct ? 'font-semibold text-green-800' : 'text-gray-700'}>
                                  {option.optionText}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default Quiz;
