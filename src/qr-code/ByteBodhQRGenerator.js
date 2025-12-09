import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";
import { toPng, toJpeg } from "html-to-image";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaPalette, FaBolt, FaCompressAlt, FaDownload, FaShareAlt, FaRandom, FaUpload, FaTimes } from "react-icons/fa";
import "./ByteBodhQRGenerator.css";
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
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
      } else handleDownloadClick();
    } catch (error) {
      console.error("Error sharing image", error);
      notify("Error sharing QR Code", "error");
    } finally {
      setIsGenerating(false);
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

  const quickActions = [
    { label: "ByteBodh Website", url: "https://bytebodh.in" },
    { label: "Contact Email", url: "mailto:info@bytebodh.in" },
    { label: "Phone Number", url: "tel:8519965746" }
  ];

  return (
    <>
    <Header />
    <div className="bytebodh-qr-generator">
      {/* Header */}
      <header className="bytebodh-header py-5">
        <div className="container text-center">
          <div className="bytebodh-brand">
            <div className="bytebodh-qr-badge mb-4">
              <FaUser className="me-2" />
              QR Code Generator
            </div>
            <h1 className="bytebodh-qr-title mb-3">Create Professional QR Codes Instantly</h1>
            <p className="bytebodh-qr-subtitle">
              Generate customizable, high-quality QR codes for websites, contacts, and more
            </p>
          </div>
        </div>
      </header>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Main Card */}
            <div className="main-card card border-0 shadow-lg">
              <div className="card-body p-4 p-md-5">

                {/* Input */}
                <div className="input-section mb-5">
                  <label className="bytebodh-form-label mb-3">Enter Text or URL</label>
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      className="form-control form-control-lg bytebodh-input"
                      placeholder="https://bytebodh.com or any text..."
                      value={inputText}
                      onChange={handleInputChange}
                    />
                    <button 
                      className="btn bytebodh-input-clear" 
                      onClick={() => setInputText("")} 
                      disabled={!inputText}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions mt-3">
                    <label className="bytebodh-quick-label mb-2">Quick Actions:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {quickActions.map((action, i) => (
                        <button
                          key={i}
                          className="btn btn-sm bytebodh-quick-btn"
                          onClick={() => handleQuickAction(action.url)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logo & Title Upload Section */}
                <div className="logo-title-section mb-4">
                  <div className="row g-4">
                    {/* Logo Upload */}
                    <div className="col-md-6">
                      <div className="logo-upload-card">
                        <label className="bytebodh-form-label mb-3">Upload Logo (Optional)</label>
                        <div className="logo-upload-area mb-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="d-none"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload" className="logo-upload-btn">
                            <FaUpload className="me-2" />
                            Choose Logo
                          </label>
                          {logoPreview && (
                            <div className="logo-preview-container mt-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="logo-preview">
                                  <img 
                                    src={logoPreview} 
                                    alt="Logo preview" 
                                    className="img-fluid rounded"
                                    style={{ 
                                      width: '60px', 
                                      height: '60px',
                                      objectFit: 'contain'
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="mb-1 text-muted small">{logoFile?.name}</p>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={handleRemoveLogo}
                                  >
                                    <FaTimes className="me-1" /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Logo Size Options */}
                        <div className="logo-size-options mt-3">
                          <label className="form-label small text-muted mb-2">Logo Size:</label>
                          <div className="d-flex gap-3">
                            {logoSizeOptions.map((option) => (
                              <div key={option.value} className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input bytebodh-radio"
                                  name="logoSize"
                                  value={option.value}
                                  checked={logoSize === option.value}
                                  onChange={() => handleLogoSizeChange(option.value)}
                                  disabled={!logoPreview}
                                />
                                <label className="form-check-label bytebodh-radio-label small">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="col-md-6">
                      <div className="title-input-card">
                        <label className="bytebodh-form-label mb-3">Add Title (Optional)</label>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control bytebodh-input"
                            placeholder="Enter title for your QR code..."
                            value={title}
                            onChange={handleTitleChange}
                            maxLength={50}
                          />
                        </div>
                        
                        {/* Title Color Options */}
                        <div className="title-color-options">
                          <label className="form-label small text-muted mb-2">Title Color:</label>
                          <div className="d-flex flex-wrap gap-2">
                            {titleColors.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                className={`bytebodh-color-btn-sm ${titleColor === color.value ? "active" : ""}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => handleTitleColorChange(color.value)}
                                disabled={!title}
                                title={color.name}
                              >
                                {titleColor === color.value && <span className="color-tick-sm">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="color-section mb-4">
                  <div className="row g-4">
                    {/* Foreground */}
                    <div className="col-md-6">
                      <div className="color-picker-card">
                        <label className="bytebodh-form-label mb-3">Foreground Color</label>
                        <div className="color-grid">
                          {fgColors.map((color) => (
                            <div key={color.value} className="color-item">
                              <button
                                type="button"
                                className={`bytebodh-color-btn ${fgColor === color.value ? "active" : ""}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => handleFgColorChange(color.value)}
                              >
                                {fgColor === color.value && <span className="color-tick">✓</span>}
                              </button>
                              <small className="color-name">{color.name.replace("ByteBodh ", "")}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Background */}
                    <div className="col-md-6">
                      <div className="color-picker-card">
                        <label className="bytebodh-form-label mb-3">Background Color</label>
                        <div className="color-grid">
                          {bgColors.map((color) => (
                            <div key={color.value} className="color-item">
                              <button
                                type="button"
                                className={`bytebodh-color-btn ${bgColor === color.value ? "active" : ""}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => handleBgColorChange(color.value)}
                              >
                                {bgColor === color.value && <span className="color-tick">✓</span>}
                              </button>
                              <small className="color-name">{color.name}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Format + Size */}
                <div className="download-options mb-4">
                  <div className="row g-4">
                    {/* Format */}
                    <div className="col-md-6">
                      <div className="format-section">
                        <label className="bytebodh-form-label mb-3">Download Format</label>
                        <div className="d-flex gap-3 flex-wrap">
                          {downloadFormats.map((format) => (
                            <div key={format.value} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input bytebodh-radio"
                                name="downloadFormat"
                                value={format.value}
                                checked={downloadFormat === format.value}
                                onChange={() => handleFormatChange(format.value)}
                              />
                              <label className="form-check-label bytebodh-radio-label">{format.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="col-md-6">
                      <div className="size-section">
                        <label className="bytebodh-form-label mb-3">Image Size</label>
                        <div className="d-flex gap-3 flex-wrap">
                          {imageSizes.map((size) => (
                            <div key={size.value} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input bytebodh-radio"
                                name="imageSize"
                                value={size.value}
                                checked={imageSize === size.value}
                                onChange={() => handleSizeChange(size.value)}
                              />
                              <label className="form-check-label bytebodh-radio-label">{size.label} ({size.size}px)</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Preview */}
                {inputText && (
                  <div className="qr-display-section mb-5 text-center">
                    <div className="qr-frame mx-auto">
                      <div className="qr-container p-4 rounded-3 shadow-sm" style={{ backgroundColor: bgColor }} ref={qrRef}>
                        <QRCode 
                          value={inputText} 
                          fgColor={fgColor} 
                          bgColor={bgColor} 
                          size={256}
                        />
                        {logoPreview && (
                          <div className="qr-logo-overlay">
                            <img 
                              src={logoPreview} 
                              alt="Logo" 
                              style={{ 
                                width: `${logoSizeOptions.find(l => l.value === logoSize)?.size || 60}px`,
                                height: `${logoSizeOptions.find(l => l.value === logoSize)?.size || 60}px`,
                                objectFit: 'contain',
                                backgroundColor: 'white',
                                padding: '5px',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {title && (
                      <div className="qr-title mt-3">
                        <h5 className="mb-0" style={{ color: titleColor }}>
                          {title}
                        </h5>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="bytebodh-preview-text mb-2">Scan this QR code with your device camera</p>
                      <small className="bytebodh-preview-size">
                        Preview • Download size: {imageSizes.find((s) => s.value === imageSize)?.label}
                        {logoPreview && " • With Logo"}
                        {title && " • With Title"}
                      </small>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="action-section">
                  <div className="row g-3">
                    <div className="col-sm-6 col-lg-3">
                      <button className="btn bytebodh-secondary-btn w-100 py-3" onClick={handleRandomColors} disabled={isGenerating}>
                        <FaRandom className="me-2" /> Random Colors
                      </button>
                    </div>

                    <div className="col-sm-6 col-lg-3">
                      <button className="btn bytebodh-primary-btn w-100 py-3" onClick={handleDownloadClick} disabled={!inputText || isGenerating}>
                        {isGenerating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span> Generating...
                          </>
                        ) : (
                          <>
                            <FaDownload className="me-2" /> Download
                          </>
                        )}
                      </button>
                    </div>

                    <div className="col-sm-6 col-lg-3">
                      <button className="btn bytebodh-gradient-btn w-100 py-3" onClick={handleShareClick} disabled={!inputText || isGenerating}>
                        <FaShareAlt className="me-2" /> Share QR
                      </button>
                    </div>

                    <div className="col-sm-6 col-lg-3">
                      <button
                        className="btn bytebodh-outline-btn w-100 py-3"
                        disabled={isGenerating}
                        onClick={handleResetAll}
                      >
                        <FaRandom className="me-2" /> Reset All
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Features */}
            <div className="features-grid row mt-5">
              <div className="col-md-4 mb-4">
                <div className="bytebodh-feature-card text-center p-4">
                  <div className="bytebodh-feature-icon mb-3">
                    <FaBolt />
                  </div>
                  <h5 className="bytebodh-feature-title">Lightning Fast</h5>
                  <p className="bytebodh-feature-text">Generate QR codes instantly</p>
                </div>
              </div>

              <div className="col-md-4 mb-4">
                <div className="bytebodh-feature-card text-center p-4">
                  <div className="bytebodh-feature-icon mb-3">
                    <FaPalette />
                  </div>
                  <h5 className="bytebodh-feature-title">Customizable</h5>
                  <p className="bytebodh-feature-text">Multiple color and style options</p>
                </div>
              </div>

              <div className="col-md-4 mb-4">
                <div className="bytebodh-feature-card text-center p-4">
                  <div className="bytebodh-feature-icon mb-3">
                    <FaCompressAlt />
                  </div>
                  <h5 className="bytebodh-feature-title">Optimized Sizes</h5>
                  <p className="bytebodh-feature-text">Perfect for any use case</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bytebodh-qr-cta py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <p className="bytebodh-cta-text mb-0">
                <strong>Need custom QR solutions for your business?</strong> Contact ByteBodh for enterprise-grade QR code generation and management.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
    </div>
    <Footer />
    </>
  );
};

export default ByteBodhQRGenerator;