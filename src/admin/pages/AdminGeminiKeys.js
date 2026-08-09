import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { toast } from "react-toastify";
import {
  getAllGeminiKeys,
  createGeminiKey,
  updateGeminiKey,
  deleteGeminiKey,
} from "../../api/geminiKeyService";
import {
  FaKey,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const AdminGeminiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", apiKey: "", active: true });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllGeminiKeys();
      setKeys(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load Gemini API keys:", err);
      toast.error("Failed to load Gemini API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ name: "", apiKey: "", active: true });
    setShowModal(true);
  };

  const openEditModal = (key) => {
    setEditingId(key.id);
    setForm({ name: key.name || "", apiKey: "", active: key.active });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Key name is required");
      return;
    }
    if (!editingId && !form.apiKey.trim()) {
      toast.error("API key value is required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      active: form.active,
    };
    if (form.apiKey.trim()) {
      payload.apiKey = form.apiKey.trim();
    }
    try {
      setSubmitting(true);
      if (editingId) {
        await updateGeminiKey(editingId, payload);
        toast.success("Gemini API key updated successfully");
      } else {
        await createGeminiKey(payload);
        toast.success("Gemini API key saved successfully");
      }
      setShowModal(false);
      fetchKeys();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save Gemini API key");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteGeminiKey(toDelete.id);
      toast.success("Gemini API key deleted successfully");
      fetchKeys();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete Gemini API key");
    } finally {
      setShowDeleteModal(false);
      setToDelete(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Gemini API Keys">
      <div className="p-6 max-w-5xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FaKey className="text-indigo-600" /> Gemini API Keys
            </h1>
            <p className="text-slate-600 mt-1">Manage Gemini API keys used to power the AI chatbot / assistant.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-150"
          >
            <FaPlus className="text-sm" /> Add Key
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-slate-600 font-semibold">Loading keys...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FaKey size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Gemini API keys configured</h3>
            <p className="text-slate-500 mt-1">Add a key to enable AI-powered features.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Key</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3 font-semibold text-slate-800">{k.name}</td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-500">{k.apiKey}</td>
                      <td className="px-6 py-3 text-center">
                        {k.active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                            <FaCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-500">{k.createdTime ? new Date(k.createdTime).toLocaleDateString() : "—"}</td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(k)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 transition-all" title="Edit">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => { setToDelete(k); setShowDeleteModal(true); }} className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 transition-all" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? "Edit Gemini Key" : "Add Gemini Key"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Key Name <span className="text-rose-500">*</span></label>
                <input type="text" value={form.name} placeholder="e.g. Primary Key"
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  API Key {editingId ? <span className="text-slate-400 font-normal">(leave blank to keep current)</span> : <span className="text-rose-500">*</span>}
                </label>
                <input type="text" value={form.apiKey} placeholder="AIzaSy..."
                  onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm" />
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Active</span>
                <input type="checkbox" checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} disabled={submitting}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50">
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && toDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                <FaTrash size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete Key</h3>
                <p className="text-xs text-slate-500">This action is irreversible</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Delete the key <strong>{toDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowDeleteModal(false); setToDelete(null); }} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminGeminiKeys;
