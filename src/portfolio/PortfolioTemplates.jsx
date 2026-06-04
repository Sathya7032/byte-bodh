import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaFolder,
  FaDownload,
  FaShoppingBag,
  FaRocket,
  FaSpinner,
  FaPalette,
  FaEye
} from "react-icons/fa";
import DashboardLayout from "./components/DashboardLayout";
import { getUser } from "../services/auth";
import {
  getAllTemplates,
  getUserTemplates,
  activateTemplate,
  createPaymentOrder,
  verifyPayment,
  recordPaymentFailure
} from "../api/templateService";

const PortfolioTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [processingId, setProcessingId] = useState(null);
  const [user, setUser] = useState(null);

  // Fallback mock images if previewImageUrl is empty
  const mockImageMap = {
    1: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80", // Resume/Minimal
    2: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80", // Monospace/Monochrome
    3: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80", // Creative/Gallery
    4: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"  // Executive
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [allRes, userRes] = await Promise.all([
        getAllTemplates(),
        getUserTemplates()
      ]);

      if (allRes.data?.success) {
        setTemplates(allRes.data.data || []);
      } else {
        setTemplates(allRes.data || []); // Fallback in case of direct array
      }

      if (userRes.data?.success) {
        setUserTemplates(userRes.data.data || []);
      } else {
        setUserTemplates(userRes.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch templates. Please check if server is active.");
      toast.error("Error loading templates database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getUser());
    fetchData();
  }, []);

  const handleActivate = async (templateId) => {
    try {
      setProcessingId(templateId);
      const res = await activateTemplate(templateId);
      if (res.data?.success) {
        toast.success(res.data.message || "Template activated successfully!");
        fetchData();
      } else {
        toast.error(res.data?.message || "Failed to activate template");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error activating template. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePurchase = async (template) => {
    try {
      setProcessingId(template.id);
      
      // 1. Create payment order on server
      const orderRes = await createPaymentOrder({ templateId: template.id });
      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.message || "Order creation failed on backend");
      }

      const orderData = orderRes.data.data;

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setProcessingId(null);
        return;
      }

      // 3. Configure Checkout Options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ByteBodh",
        description: `Unlock Template: ${template.templateName}`,
        order_id: orderData.orderId || orderData.id,
        handler: async function (response) {
          try {
            setProcessingId(template.id);
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              templateId: template.id
            });

            if (verifyRes.data?.success) {
              toast.success("Payment verified! Template unlocked successfully!");
              fetchData();
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            toast.error(verifyErr.response?.data?.message || "Failed to verify transaction");
          } finally {
            setProcessingId(null);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#6C63FF",
        },
        modal: {
          ondismiss: async function () {
            toast.warning("Payment cancelled by user.");
            // Record failure locally
            try {
              await recordPaymentFailure({
                razorpay_order_id: orderData.orderId || orderData.id,
                error_code: "PAYMENT_CANCELLED",
                error_description: "Payment cancelled by the user",
                templateId: template.id
              });
            } catch (failErr) {
              console.error("Failed recording failure:", failErr);
            }
            setProcessingId(null);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to start payment checkout");
      setProcessingId(null);
    }
  };

  const handleFreeActivation = async (template) => {
    // Free templates are immediately activated on activateTemplate in backend
    await handleActivate(template.id);
  };

  const categories = ["All", ...new Set(templates.map((t) => t.category).filter(Boolean))];

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FaPalette className="text-[#6C63FF]" /> Portfolio Templates
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Choose a professional template to represent your online resume.
          </p>
        </div>
      </div>

      {/* Categories filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-2xl border border-gray-200/50 max-w-2xl">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/20"
                : "text-gray-500 hover:text-gray-800 hover:bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
          <div className="relative inline-block">
            <div className="w-12 h-12 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
            <FaSpinner className="absolute inset-0 m-auto text-[#6C63FF] text-lg animate-spin" />
          </div>
          <p className="text-gray-500 mt-6 font-semibold">Loading portfolios catalog...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty list */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">📂</div>
          <p className="text-gray-500 font-semibold">No templates found in this category.</p>
        </div>
      )}

      {/* Template Catalog Grid */}
      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const userTemplate = userTemplates.find((ut) => ut.templateId === template.id);
            const isPurchased = !!userTemplate;
            const isActive = userTemplate?.active || false;
            const previewUrl = template.previewImageUrl || mockImageMap[template.id] || mockImageMap[1];

            return (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Preview Banner */}
                  <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden border-b border-gray-100">
                    <img
                      src={previewUrl}
                      alt={template.templateName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => window.open(`/templates/preview/${template.id}`, '_blank')}
                        className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 shadow-lg flex items-center gap-1.5 transition-all"
                      >
                        <FaEye /> Live Preview
                      </button>
                    </div>

                    {/* Price/Status Tag */}
                    <div className="absolute top-4 right-4">
                      {isPurchased ? (
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md flex items-center gap-1.5 ${
                            isActive
                              ? "bg-emerald-500 text-white shadow-emerald-500/20"
                              : "bg-blue-600 text-white shadow-blue-500/20"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <FaCheckCircle /> ACTIVE
                            </>
                          ) : (
                            <>
                              <FaCheckCircle /> OWNED
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md bg-white border border-gray-100 text-[#6C63FF] shadow-slate-950/5">
                          {template.isFree ? "FREE" : `₹${template.cost || 0}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      {template.category && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[#6C63FF] text-[10px] font-extrabold uppercase tracking-wide">
                          <FaFolder size={9} /> {template.category}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold tracking-wide">
                        <FaDownload size={9} /> {template.downloadsCount || 0} Uses
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                      {template.templateName}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {template.description || "Beautiful portfolio outline to present details, timeline and responsive references."}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 text-left border-t border-gray-50 mt-4">
                  {isPurchased ? (
                    <button
                      disabled={isActive || processingId === template.id}
                      onClick={() => handleActivate(template.id)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isActive
                          ? "bg-slate-100 text-slate-400 cursor-default"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {processingId === template.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
                          Activating...
                        </>
                      ) : isActive ? (
                        "Currently Active Theme"
                      ) : (
                        <>
                          <FaRocket /> Activate Layout
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={processingId === template.id}
                      onClick={() =>
                        template.isFree ? handleFreeActivation(template) : handlePurchase(template)
                      }
                      className="w-full bg-[#6C63FF] hover:bg-[#5b52e6] text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#6C63FF]/15 hover:shadow-lg hover:shadow-[#6C63FF]/30 flex items-center justify-center gap-2"
                    >
                      {processingId === template.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : template.isFree ? (
                        <>
                          <FaRocket /> Get Template (Free)
                        </>
                      ) : (
                        <>
                          <FaShoppingBag /> Purchase Template (₹{template.cost || 0})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PortfolioTemplates;
