import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";
import { toPng, toJpeg } from "html-to-image";
import { 
  FaUser, 
  FaPalette, 
  FaBolt, 
  FaDownload, 
  FaShareAlt, 
  FaUpload, 
  FaTimes,
  FaCopy,
  FaCheck,
  FaTrash,
  FaPaintBrush,
  FaExpand
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ByteBodhQRGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [imageSize, setImageSize] = useState("medium");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoSize, setLogoSize] = useState("medium");
  const [title, setTitle] = useState("");
  const [titleColor, setTitleColor] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  const fgColors = [
    { name: "ByteBodh Black", value: "#000000" },
    { name: "ByteBodh Blue", value: "#0284c7" },
    { name: "ByteBodh Red", value: "#e74c3c" },
    { name: "ByteBodh Green", value: "#27ae60" },
    { name: "ByteBodh Purple", value: "#9b59b6" },
    { name: "ByteBodh Dark", value: "#0f172a" }
  ];

  const bgColors = [
    { name: "Pure White", value: "#ffffff" },
    { name: "ByteBodh Light", value: "#f8fafc" },
    { name: "Light Gray", value: "#f1f5f9" },
    { name: "Warm Cream", value: "#fdf6e3" },
    { name: "Ice Blue", value: "#f0f9ff" },
    { name: "Mint Cream", value: "#f0fdf4" }
  ];

  const titleColors = [
    { name: "Black", value: "#000000" },
    { name: "ByteBodh Blue", value: "#0284c7" },
    { name: "Dark Gray", value: "#334155" },
    { name: "ByteBodh Dark", value: "#0f172a" },
    { name: "ByteBodh Green", value: "#27ae60" },
    { name: "ByteBodh Purple", value: "#9b59b6" }
  ];

  const downloadFormats = [
    { value: "png", label: "PNG", quality: 0.9 },
    { value: "jpeg", label: "JPEG", quality: 0.8 },
    { value: "jpg", label: "JPG", quality: 0.8 }
  ];

  const imageSizes = [
    { value: "small", label: "Small", size: 300, pixelRatio: 1 },
    { value: "medium", label: "Medium", size: 512, pixelRatio: 1.5 },
    { value: "large", label: "Large", size: 768, pixelRatio: 2 }
  ];

  const logoSizeOptions = [
    { value: "small", label: "Small", size: 40 },
    { value: "medium", label: "Medium", size: 60 },
    { value: "large", label: "Large", size: 80 }
  ];

  const quickActions = [
    { label: "ByteBodh Website", url: "https://bytebodh.in" },
    { label: "Contact Email", url: "mailto:info@bytebodh.in" },
    { label: "Phone Number", url: "tel:+918519965746" },
    { label: "WhatsApp", url: "https://wa.me/918519965746" },
    { label: "LinkedIn", url: "https://linkedin.com/company/bytebodh" },
    { label: "GitHub", url: "https://github.com/bytebodh" }
  ];

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFgColorChange = (colorValue) => {
    setFgColor(colorValue);
  };

  const handleBgColorChange = (colorValue) => {
    setBgColor(colorValue);
  };

  const handleFormatChange = (format) => {
    setDownloadFormat(format);
  };

  const handleSizeChange = (size) => {
    setImageSize(size);
  };

  const handleLogoSizeChange = (size) => {
    setLogoSize(size);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleColorChange = (colorValue) => {
    setTitleColor(colorValue);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        notify("Please upload an image file", "error");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        notify("File size should be less than 5MB", "error");
        return;
      }
      
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      notify("Logo uploaded successfully!");
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRandomColor = (colorArray) => {
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex].value;
  };

  const handleRandomColors = () => {
    const randomFgColor = getRandomColor(fgColors);
    const randomBgColor = getRandomColor(bgColors);
    const randomTitleColor = getRandomColor(titleColors);

    setFgColor(randomFgColor);
    setBgColor(randomBgColor);
    setTitleColor(randomTitleColor);
    notify("Random colors applied!");
  };

  const notify = (message, type = "success") => {
    if (type === "success") toast.success(message);
    else toast.error(message);
  };

  const generateImage = async () => {
    if (!qrRef.current) throw new Error("QR code reference is null.");

    const formatConfig = downloadFormats.find((f) => f.value === downloadFormat);
    const sizeConfig = imageSizes.find((s) => s.value === imageSize);

    const options = {
      quality: formatConfig?.quality || 0.9,
      pixelRatio: sizeConfig?.pixelRatio || 1.5,
      width: sizeConfig?.size || 512,
      height: sizeConfig?.size || 512,
      canvasWidth: sizeConfig?.size || 512,
      canvasHeight: sizeConfig?.size || 512,
      style: {
        transform: "none",
        width: `${sizeConfig?.size || 512}px`,
        height: `${sizeConfig?.size || 512}px`
      }
    };

    switch (downloadFormat) {
      case "png":
        return await toPng(qrRef.current, options);
      case "jpeg":
      case "jpg":
        return await toJpeg(qrRef.current, options);
      default:
        return await toPng(qrRef.current, options);
    }
  };

  const handleDownloadClick = async () => {
    if (!inputText) return notify("Please enter text or URL first!", "error");

    setIsGenerating(true);
    try {
      const dataUrl = await generateImage();
      const sizeLabel = imageSizes.find((s) => s.value === imageSize)?.label || "Medium";
      const fileName = `bytebodh-qr-${sizeLabel.toLowerCase()}.${downloadFormat}`;

      saveAs(dataUrl, fileName);
      notify(`QR Code downloaded as ${downloadFormat.toUpperCase()} (${sizeLabel})!`);
    } catch (err) {
      console.error("Error generating image", err);
      notify("Error downloading QR Code", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareClick = async () => {
    if (!inputText) return notify("Please enter text or URL first!", "error");
    if (!qrRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await generateImage();
      const blob = await (await fetch(dataUrl)).blob();
      const sizeLabel = imageSizes.find((s) => s.value === imageSize)?.label || "Medium";
      const file = new File([blob], `bytebodh-qr-${sizeLabel.toLowerCase()}.${downloadFormat}`, {
        type: `image/${downloadFormat === "png" ? "png" : "jpeg"}`
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "ByteBodh QR Code",
          text: "Check out this QR code generated by ByteBodh!",
          files: [file]
        });
        notify("QR Code shared successfully!");
      } else {
        handleCopyToClipboard();
      }
    } catch (error) {
      console.error("Error sharing image", error);
      notify("Error sharing QR Code", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!inputText) return;
    
    try {
      await navigator.clipboard.writeText(inputText);
      setCopied(true);
      notify("Text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      notify("Failed to copy to clipboard", "error");
    }
  };

  const handleQuickAction = (url) => {
    setInputText(url);
    notify(`Quick QR for: ${url}`);
  };

  const handleResetAll = () => {
    setInputText("");
    setFgColor("#000000");
    setBgColor("#ffffff");
    setImageSize("medium");
    setLogoFile(null);
    setLogoPreview(null);
    setLogoSize("medium");
    setTitle("");
    setTitleColor("#000000");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    notify("All settings have been reset!");
  };

  const getLogoSize = () => {
    return logoSizeOptions.find(l => l.value === logoSize)?.size || 60;
  };

  const getImageSizeConfig = () => {
    return imageSizes.find(s => s.value === imageSize) || imageSizes[1];
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium mb-6">
                <FaUser className="mr-2" />
                QR Code Generator
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Create Professional <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">QR Codes</span> Instantly
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Generate customizable, high-quality QR codes for websites, contacts, WiFi, and more
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-100">
                {/* Input Section */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Enter Text or URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                      placeholder="https://bytebodh.in or any text..."
                      value={inputText}
                      onChange={handleInputChange}
                    />
                    {inputText && (
                      <button 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setInputText("")}
                      >
                        <FaTimes className="text-xl" />
                      </button>
                    )}
                    {inputText && (
                      <button
                        className="absolute right-12 top-3 text-blue-500 hover:text-blue-600"
                        onClick={handleCopyToClipboard}
                        title="Copy to clipboard"
                      >
                        {copied ? <FaCheck className="text-lg" /> : <FaCopy className="text-lg" />}
                      </button>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Quick Actions:</label>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, i) => (
                        <button
                          key={i}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                          onClick={() => handleQuickAction(action.url)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logo & Title Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Logo Upload */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Logo (Optional)
                    </label>
                    <div className="mb-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                      >
                        <FaUpload className="mr-2" />
                        Choose Logo
                      </label>
                      {logoPreview && (
                        <div className="mt-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-16 h-16 object-contain rounded-lg border-2 border-gray-200"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 truncate">{logoFile?.name}</p>
                              <button
                                className="mt-2 inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                onClick={handleRemoveLogo}
                              >
                                <FaTrash className="mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Logo Size Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Logo Size:
                      </label>
                      <div className="flex space-x-4">
                        {logoSizeOptions.map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center space-x-2 cursor-pointer ${!logoPreview ? 'opacity-50' : ''}`}
                          >
                            <input
                              type="radio"
                              name="logoSize"
                              value={option.value}
                              checked={logoSize === option.value}
                              onChange={() => handleLogoSizeChange(option.value)}
                              disabled={!logoPreview}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Add Title (Optional)
                    </label>
                    <div className="mb-4">
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Enter title for your QR code..."
                        value={title}
                        onChange={handleTitleChange}
                        maxLength={50}
                      />
                    </div>
                    
                    {/* Title Color Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Title Color:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {titleColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${titleColor === color.value ? 'border-blue-500' : 'border-gray-300'} ${!title ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleTitleColorChange(color.value)}
                            disabled={!title}
                            title={color.name}
                          >
                            {titleColor === color.value && (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                <FaCheck className="text-xs" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Foreground Color */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Foreground Color
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {fgColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`relative p-4 rounded-xl border-2 ${fgColor === color.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} hover:border-blue-400 transition-all duration-200`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleFgColorChange(color.value)}
                        >
                          {fgColor === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FaCheck className="text-white text-lg drop-shadow-lg" />
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-700 font-medium truncate">
                            {color.name.replace("ByteBodh ", "")}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Background Color
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {bgColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`relative p-4 rounded-xl border-2 ${bgColor === color.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} hover:border-blue-400 transition-all duration-200`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleBgColorChange(color.value)}
                        >
                          {bgColor === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FaCheck className="text-gray-800 text-lg" />
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-700 font-medium truncate">
                            {color.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Format & Size Options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Download Format */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Download Format
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {downloadFormats.map((format) => (
                        <label
                          key={format.value}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="downloadFormat"
                            value={format.value}
                            checked={downloadFormat === format.value}
                            onChange={() => handleFormatChange(format.value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 font-medium">{format.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Image Size */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Image Size
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {imageSizes.map((size) => (
                        <label
                          key={size.value}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="imageSize"
                            value={size.value}
                            checked={imageSize === size.value}
                            onChange={() => handleSizeChange(size.value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 font-medium">
                            {size.label} ({size.size}px)
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* QR Preview */}
                {inputText && (
                  <div className="mb-8 text-center">
                    <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                      <div
                        className="flex flex-col items-center justify-center rounded-xl"
                        style={{ backgroundColor: bgColor }}
                        ref={qrRef}
                      >
                        {logoPreview && (
                          <div className="mb-4 flex items-center justify-center">
                            <div
                              className="bg-white p-2 rounded-lg shadow-lg"
                              style={{
                                width: `${getLogoSize()}px`,
                                height: `${getLogoSize()}px`,
                              }}
                            >
                              <img
                                src={logoPreview}
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-center">
                          <QRCode 
                            value={inputText} 
                            fgColor={fgColor} 
                            bgColor={bgColor} 
                            size={256}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      {title && (
                        <div className="mt-4">
                          <h3
                            className="text-xl font-bold"
                            style={{ color: titleColor }}
                          >
                            {title}
                          </h3>
                        </div>
                      )}
                      <div className="mt-4 space-y-2">
                        <p className="text-gray-600">
                          Scan this QR code with your device camera
                        </p>
                        <div className="text-sm text-gray-500">
                          Preview • Download size: {getImageSizeConfig().label}
                          {logoPreview && " • With Logo"}
                          {title && " • With Title"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    onClick={handleRandomColors}
                    disabled={isGenerating}
                  >
                    <FaPaintBrush />
                    <span>Random Colors</span>
                  </button>

                  <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDownloadClick}
                    disabled={!inputText || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        <span>Download</span>
                      </>
                    )}
                  </button>

                  <button
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleShareClick}
                    disabled={!inputText || isGenerating}
                  >
                    <FaShareAlt />
                    <span>Share QR</span>
                  </button>

                  <button
                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    onClick={handleResetAll}
                    disabled={isGenerating}
                  >
                    <FaTrash />
                    <span>Reset All</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <FaBolt className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Generate QR codes instantly</p>
                </div>

                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                    <FaPalette className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Customizable</h3>
                  <p className="text-gray-600">Multiple color and style options</p>
                </div>

                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                    <FaExpand className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Optimized Sizes</h3>
                  <p className="text-gray-600">Perfect for any use case</p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Need Custom QR Solutions?
                </h3>
                <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                  Contact ByteBodh for enterprise-grade QR code generation and management solutions tailored for your business.
                </p>
                <a
                  href="mailto:info@bytebodh.in"
                  className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
    </>
  );
};

export default ByteBodhQRGenerator;