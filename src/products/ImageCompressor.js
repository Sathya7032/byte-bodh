import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState(800);
  const [maxHeight, setMaxHeight] = useState(800);
  const [isCompressing, setIsCompressing] = useState(false);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage({ file, preview: imageUrl });
      setCompressedImage(null);
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Compress the image
  const handleCompress = () => {
    if (!originalImage) return;

    setIsCompressing(true);
    Resizer.imageFileResizer(
      originalImage.file,
      maxWidth,
      maxHeight,
      'JPEG', // Can be 'JPEG', 'PNG', or 'WEBP'
      quality,
      0, // Rotation
      (compressedUri) => {
        setCompressedImage(compressedUri);
        setIsCompressing(false);
      },
      'base64' // Output format: 'base64' or 'blob'
    );
  };

  // Download the compressed image
  const handleDownload = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset the component
  const handleReset = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setQuality(70);
    setMaxWidth(800);
    setMaxHeight(800);
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Image Size Compressor</h1>
          <p className="text-gray-600">Upload an image, adjust settings, and reduce its file size.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Upload Image</h2>
              <label className="block w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p>Click to select an image</p>
                    <p className="text-sm mt-1">Supports JPG, PNG, WEBP</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Compression Settings</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: <span className="font-bold">{quality}%</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller File</span>
                    <span>Better Quality</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Width: <span className="font-bold">{maxWidth}px</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Height: <span className="font-bold">{maxHeight}px</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCompress}
                  disabled={!originalImage || isCompressing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompressing ? 'Compressing...' : 'Compress Image'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
                >
                  Reset All
                </button>
              </div>
              {compressedImage && (
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
                  Download Compressed Image
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Image Preview & Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Preview & Results</h2>
              
              {!originalImage ? (
                <div className="text-center py-16 text-gray-500">
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p>Upload an image to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Original Image */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Original Image</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={originalImage.preview}
                        alt="Original preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>File size: {(originalImage.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>

                  {/* Compressed Image */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Compressed Image</h3>
                    {compressedImage ? (
                      <>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={compressedImage}
                            alt="Compressed preview"
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <p className="text-green-600 font-medium">Compression successful!</p>
                          <p className="mt-1">Estimated size reduction: ~{Math.round((1 - quality/100) * 100)}%</p>
                        </div>
                      </>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                        <p className="text-gray-500">Compressed image will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ImageCompressor;