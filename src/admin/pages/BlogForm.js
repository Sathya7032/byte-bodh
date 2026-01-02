// pages/BlogForm.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { createBlog, updateBlog, getBlogById } from "../../api/blogs";
import { getCategories } from "../../api/categories";
import DashboardLayout from "../DashboardLayout";
import { toast } from "react-toastify";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    readTime: 5,
    isFeatured: false,
    categoryId: "",
  });

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const placeholder = "Write your blog content here...";

  const formats = [
    "header", "font", "size",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "script",
    "list", "bullet", "indent",
    "link", "image", "video", "align",
    "blockquote", "code-block"
  ];

  const { quillRef, quill } = useQuill({ 
    theme: "snow", 
    modules, 
    formats, 
    placeholder 
  });

  // Handle Quill editor content changes
  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        const content = quill.root.innerHTML;
        setFormData(prev => ({
          ...prev,
          description: content,
        }));
      };

      quill.on("text-change", handleTextChange);

      // Set initial content if editing
      if (formData.description && isEditMode) {
        quill.clipboard.dangerouslyPasteHTML(formData.description);
      }

      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, isEditMode]);

  // Update Quill content when formData.description changes (for edit mode)
  useEffect(() => {
    if (quill && formData.description && quill.root.innerHTML !== formData.description) {
      quill.clipboard.dangerouslyPasteHTML(formData.description);
    }
  }, [formData.description, quill]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch blog data if in edit mode
  const fetchBlog = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await getBlogById(id);
      const blog = res.data.data;
      
      // Parse description to handle any data type
      const parseDescription = (desc) => {
        if (!desc) return "";
        if (typeof desc === 'string') return desc;
        if (typeof desc === 'object') {
          try {
            // Try to extract HTML content if it's a complex object
            if (desc.html) return desc.html;
            if (desc.content) return desc.content;
            if (desc.ops) {
              // Handle Delta format
              try {
                return JSON.stringify(desc);
              } catch {
                return String(desc);
              }
            }
            return JSON.stringify(desc);
          } catch (e) {
            return String(desc || '');
          }
        }
        return String(desc || '');
      };

      const description = parseDescription(blog.description);
      
      setFormData({
        title: blog.title || "",
        description: description,
        author: blog.author || "",
        readTime: blog.readTime || 5,
        isFeatured: blog.isFeatured || false,
        categoryId: blog.category?.id || "",
      });
      
      if (blog.imageUrl) {
        setImagePreview(blog.imageUrl);
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      toast.error("Failed to load blog data");
      navigate("/admin-blogs");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEditMode) {
      fetchBlog();
    }
  }, [isEditMode, fetchBlog]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a blog title");
      return false;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return false;
    }

    // Get editor content
    let editorContent = formData.description;
    if (quill) {
      editorContent = quill.root.innerHTML;
    }

    // Check if description has meaningful content
    const cleanDescription = editorContent
      ?.replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces
      .trim();

    if (!editorContent || 
        editorContent === '<p><br></p>' ||
        editorContent === '<p></p>' ||
        !cleanDescription ||
        cleanDescription.length === 0) {
      toast.error("Please enter blog content");
      return false;
    }

    // Optional: Add more validations as needed
    if (formData.readTime < 1) {
      toast.error("Read time must be at least 1 minute");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Get latest content from Quill editor
      let description = formData.description;
      if (quill) {
        description = quill.root.innerHTML;
      }

      // Prepare form data for API
      const blogData = {
        title: formData.title.trim(),
        description: description,
        author: formData.author.trim(),
        readTime: parseInt(formData.readTime) || 5,
        isFeatured: formData.isFeatured,
        categoryId: formData.categoryId,
      };

      console.log("Submitting blog data:", blogData);

      if (isEditMode) {
        await updateBlog(id, blogData, imageFile);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(blogData, imageFile);
        toast.success("Blog created successfully!");
      }
      
      navigate("/admin-blogs");
    } catch (error) {
      console.error("Failed to save blog:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save blog. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    let hasChanges = false;
    
    // Check for changes in form fields
    if (Object.values(formData).some(val => {
      if (typeof val === 'boolean') return val !== false;
      return val && val.toString().trim();
    })) {
      hasChanges = true;
    }
    
    // Check for changes in editor
    if (quill) {
      const editorContent = quill.root.innerHTML;
      const cleanContent = editorContent
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanContent.length > 0) {
        hasChanges = true;
      }
    }
    
    // Check for image file
    if (imageFile) {
      hasChanges = true;
    }
    
    if (hasChanges) {
      if (window.confirm("Are you sure you want to leave? Unsaved changes will be lost.")) {
        navigate("/admin-blogs");
      }
    } else {
      navigate("/admin-blogs");
    }
  };

  if (loading && isEditMode) {
    return (
      <DashboardLayout pageTitle="Loading...">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading blog data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={isEditMode ? "Edit Blog" : "Create Blog"}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? "Update your blog post details" : "Fill in the details to create a new blog post"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter blog title"
              disabled={submitting}
              required
            />
          </div>

          {/* Description - Quill Editor */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
              <div 
                ref={quillRef} 
                className="min-h-[400px]"
                style={{ 
                  height: '400px',
                  border: 'none',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Use the toolbar above to format your text</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Click the image icon to insert images</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Author name"
                disabled={submitting}
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                min="1"
                max="120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-gray-500">Estimated reading time for your visitors</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                disabled={submitting}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center h-full">
              <div className="flex items-center p-4 border border-gray-300 rounded-lg w-full">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  disabled={submitting}
                />
                <label htmlFor="isFeatured" className="ml-3 text-sm text-gray-700">
                  <span className="font-medium">Featured Post</span>
                  <p className="text-gray-500">Display this post prominently on the website</p>
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {imagePreview && (
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Preview</span>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <label className={`cursor-pointer ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="inline-flex items-center px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all duration-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Image Requirements:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Recommended: 1200x630px (16:9 ratio)</li>
                    <li>• Max file size: 5MB</li>
                    <li>• Supported formats: JPEG, PNG, GIF, WebP</li>
                    <li>• Image will be displayed as blog thumbnail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Blog" : "Create Blog"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BlogForm;