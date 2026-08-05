import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { getCustomDomainConfig, updateCustomDomainConfig } from "../../api/customDomainService";
import { toast } from "react-toastify";
import {
  FaGlobe,
  FaSave,
  FaServer,
  FaDollarSign,
  FaSpinner,
  FaCog
} from "react-icons/fa";

const AdminCustomDomainConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    monthlyPrice: 99,
    yearlyPrice: 999,
    serverIp: "76.76.21.21",
    cnameTarget: "cname.bytebodh.com",
    enabled: true,
    instructions: "Point an A record to our server IP or a CNAME record to our target host."
  });

  const parseConfigData = (data) => {
    if (!data) return null;
    const monthly = Number(data.monthlyPrice ?? data.monthlyCost ?? data.priceMonthly ?? data.monthlyPlanPrice ?? 99);
    const yearly = Number(data.yearlyPrice ?? data.yearlyCost ?? data.priceYearly ?? data.yearlyPlanPrice ?? 999);
    const serverIp = data.serverIp ?? data.aRecordIp ?? data.targetIp ?? data.ipAddress ?? "76.76.21.21";
    const cnameTarget = data.cnameTarget ?? data.cname ?? data.targetCname ?? "cname.bytebodh.com";
    const enabled = data.enabled ?? data.active ?? data.isActive ?? true;
    const instructions = data.instructions ?? data.setupInstructions ?? "";

    return {
      monthlyPrice: isNaN(monthly) ? 99 : monthly,
      yearlyPrice: isNaN(yearly) ? 999 : yearly,
      serverIp,
      cnameTarget,
      enabled,
      instructions
    };
  };

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCustomDomainConfig();
      const rawData = res.data?.data || res.data;
      const parsed = parseConfigData(rawData);
      if (parsed) {
        setConfig((prev) => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (err) {
      console.error("Failed to fetch custom domain config:", err);
      toast.error("Could not load custom domain configuration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const numericMonthly = Number(config.monthlyPrice) || 0;
      const numericYearly = Number(config.yearlyPrice) || 0;

      // Construct payload compatible with all Java DTO field alias names
      const payload = {
        monthlyPrice: numericMonthly,
        monthlyCost: numericMonthly,
        priceMonthly: numericMonthly,
        monthlyPlanPrice: numericMonthly,

        yearlyPrice: numericYearly,
        yearlyCost: numericYearly,
        priceYearly: numericYearly,
        yearlyPlanPrice: numericYearly,

        serverIp: config.serverIp,
        aRecordIp: config.serverIp,
        targetIp: config.serverIp,
        ipAddress: config.serverIp,

        cnameTarget: config.cnameTarget,
        targetCname: config.cnameTarget,
        cname: config.cnameTarget,

        enabled: Boolean(config.enabled),
        active: Boolean(config.enabled),
        isActive: Boolean(config.enabled),

        instructions: config.instructions,
        setupInstructions: config.instructions
      };

      const res = await updateCustomDomainConfig(payload);
      
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || "Custom domain configuration updated successfully!");
        const updatedData = parseConfigData(res.data?.data || res.data);
        if (updatedData) {
          setConfig((prev) => ({ ...prev, ...updatedData }));
        } else {
          setConfig((prev) => ({
            ...prev,
            monthlyPrice: numericMonthly,
            yearlyPrice: numericYearly
          }));
        }
      } else {
        toast.error(res.data?.message || "Failed to update configuration");
      }
    } catch (err) {
      console.error("Error updating custom domain config:", err);
      toast.error(err.response?.data?.message || "Failed to update custom domain config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto text-left space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaGlobe className="text-blue-600" /> Custom Domain Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage custom domain pricing, DNS targets, and global domain settings for student portfolios.
            </p>
          </div>
          <button
            onClick={fetchConfig}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Refresh Settings"}
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <FaSpinner className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-sm">Loading custom domain settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pricing & Activation Settings */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <FaDollarSign className="text-green-600" /> Domain Subscription Pricing
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Monthly Price (₹)
                    </label>
                    <input
                      type="number"
                      name="monthlyPrice"
                      value={config.monthlyPrice ?? ""}
                      onChange={handleChange}
                      placeholder="99"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Yearly Price (₹)
                    </label>
                    <input
                      type="number"
                      name="yearlyPrice"
                      value={config.yearlyPrice ?? ""}
                      onChange={handleChange}
                      placeholder="999"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                      <span className="block text-sm font-bold text-gray-800">Enable Custom Domain Feature</span>
                      <span className="block text-xs text-gray-500">Allow students to search and purchase custom domain URLs</span>
                    </div>
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={config.enabled ?? true}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* DNS & Server Configuration */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <FaServer className="text-purple-600" /> DNS Server Records
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Target Server IP (A Record)
                    </label>
                    <input
                      type="text"
                      name="serverIp"
                      value={config.serverIp || ""}
                      onChange={handleChange}
                      placeholder="76.76.21.21"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Target CNAME Host
                    </label>
                    <input
                      type="text"
                      name="cnameTarget"
                      value={config.cnameTarget || ""}
                      onChange={handleChange}
                      placeholder="cname.bytebodh.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Custom Instructions / Notice
                    </label>
                    <textarea
                      name="instructions"
                      rows={3}
                      value={config.instructions || ""}
                      onChange={handleChange}
                      placeholder="Add instructions for students setting up DNS records..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <FaCog className="text-blue-400" /> Active Configuration Preview
                </h4>
                <span className="text-xs bg-green-900/80 text-green-300 px-2.5 py-0.5 rounded-full font-bold">
                  PUT /api/admin/custom-domain-config
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold">Monthly Price:</span>
                  <span className="font-bold text-base text-green-400">₹{config.monthlyPrice ?? 0}/mo</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Yearly Price:</span>
                  <span className="font-bold text-base text-green-400">₹{config.yearlyPrice ?? 0}/yr</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Server IP:</span>
                  <span className="font-bold text-blue-300">{config.serverIp || "Not configured"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">CNAME Host:</span>
                  <span className="font-bold text-purple-300">{config.cnameTarget || "Not configured"}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCustomDomainConfig;
