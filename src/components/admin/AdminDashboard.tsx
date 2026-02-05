// ============================================================
// ADMIN DASHBOARD - Main admin panel
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Shield, 
  Clock, 
  CreditCard, 
  Settings,
  LogOut,
  Check,
  XCircle,
  Calendar,
  MessageSquare,
  StickyNote,
  RefreshCw,
  Send,
  Trash2,
  Ticket,
  Plus,
  Edit3,
} from "lucide-react";
import { clearAdminSession } from "./AdminAuth";
// Use cloud storage for cross-device sync
import {
  CloudVoucherRequest,
  CloudSharedNote,
  CloudVoucherTemplate,
  fetchVoucherRequests,
  updateVoucherRequestStatus,
  removeVoucherRequest,
  fetchSharedNotes,
  submitSharedNote,
  markCloudNoteAsRead,
  removeSharedNote,
  fetchVoucherTemplates,
  createCloudVoucherTemplate,
  updateCloudVoucherTemplate,
  deleteCloudVoucherTemplate,
  getRarityFromLimit,
} from "../../utils/cloudStorage";
import {
  Flower2,
  Heart,
  Mountain,
  Film,
  UtensilsCrossed,
  Gift,
  Star,
  Coffee,
  Music,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// REDEEMABLES MANAGER COMPONENT
// Manage voucher templates (add, edit, delete) - CLOUD SYNCED
// ============================================================

// Available icons for voucher templates
const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Gift", icon: Gift },
  { name: "Flower2", icon: Flower2 },
  { name: "Heart", icon: Heart },
  { name: "Mountain", icon: Mountain },
  { name: "Film", icon: Film },
  { name: "UtensilsCrossed", icon: UtensilsCrossed },
  { name: "Star", icon: Star },
  { name: "Coffee", icon: Coffee },
  { name: "Music", icon: Music },
  { name: "Sparkles", icon: Sparkles },
];

const getIconComponent = (iconName: string): LucideIcon => {
  const found = AVAILABLE_ICONS.find(i => i.name === iconName);
  return found?.icon || Gift;
};

const RedeemablesManager = () => {
  const [templates, setTemplates] = useState<CloudVoucherTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: "",
    monthlyLimit: 1,
    iconName: "Gift",
  });

  // Load templates from cloud
  const loadTemplates = async () => {
    setIsLoading(true);
    const cloudTemplates = await fetchVoucherTemplates();
    setTemplates(cloudTemplates);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleAdd = async () => {
    if (!formData.title.trim()) return;
    setIsLoading(true);
    
    const result = await createCloudVoucherTemplate({
      type: formData.title.toLowerCase().replace(/\s+/g, "-"),
      title: formData.title,
      description: formData.description,
      options: formData.options.split(",").map(o => o.trim()).filter(Boolean),
      monthlyLimit: formData.monthlyLimit,
      iconName: formData.iconName,
    });
    
    if (result) {
      await loadTemplates();
    }
    
    setShowAddForm(false);
    setFormData({ title: "", description: "", options: "", monthlyLimit: 1, iconName: "Gift" });
    setIsLoading(false);
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    
    await updateCloudVoucherTemplate(id, {
      title: formData.title,
      description: formData.description,
      options: formData.options.split(",").map(o => o.trim()).filter(Boolean),
      monthlyLimit: formData.monthlyLimit,
      iconName: formData.iconName,
    });
    
    await loadTemplates();
    setEditingId(null);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this redeemable?")) {
      setIsLoading(true);
      await deleteCloudVoucherTemplate(id);
      await loadTemplates();
      setIsLoading(false);
    }
  };

  const startEditing = (template: CloudVoucherTemplate) => {
    setEditingId(template.id);
    setFormData({
      title: template.title,
      description: template.description,
      options: template.options.join(", "),
      monthlyLimit: template.monthlyLimit,
      iconName: template.iconName,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Voucher Templates {isLoading && "(loading...)"}
        </h3>
        <button
          onClick={() => {
            setShowAddForm(true);
            setFormData({ title: "", description: "", options: "", monthlyLimit: 1, iconName: "Gift" });
          }}
          className="px-3 py-1.5 bg-accent-pink text-white rounded-lg text-sm font-medium flex items-center gap-1"
          disabled={isLoading}
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blush-50 rounded-xl border-2 border-blush-200 space-y-3"
        >
          {/* Icon Selection */}
          <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border">
            {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setFormData({ ...formData, iconName: name })}
                className={`p-2 rounded-lg transition-colors ${
                  formData.iconName === name
                    ? "bg-accent-pink text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Title (e.g. Redeem for flowers)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Options (comma separated)"
            value={formData.options}
            onChange={(e) => setFormData({ ...formData, options: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Monthly Limit:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({ ...formData, monthlyLimit: parseInt(e.target.value) || 1 })}
                className="w-16 px-2 py-1 border rounded-lg text-sm text-center"
              />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              formData.monthlyLimit === 1 ? "bg-yellow-100 text-yellow-700" :
              formData.monthlyLimit <= 3 ? "bg-purple-100 text-purple-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {formData.monthlyLimit === 1 ? "Legendary" : formData.monthlyLimit <= 3 ? "Rare" : "Common"}
            </span>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                if (editingId) {
                  handleUpdate(editingId);
                } else {
                  handleAdd();
                }
              }}
              disabled={isLoading}
              className="flex-1 py-2 bg-accent-pink text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? "Saving..." : editingId ? "Save Changes" : "Add Voucher"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Templates List */}
      <div className="space-y-2">
        {templates.map((template) => {
          const Icon = getIconComponent(template.iconName);
          const rarity = getRarityFromLimit(template.monthlyLimit);
          return (
            <motion.div
              key={template.id}
              layout
              className={`p-3 bg-white rounded-xl border-2 transition-colors ${
                rarity === "legendary" ? "border-yellow-300 bg-yellow-50" :
                rarity === "rare" ? "border-purple-200" :
                "border-gray-100 hover:border-blush-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rarity === "legendary" ? "bg-yellow-200 text-yellow-700" :
                  rarity === "rare" ? "bg-purple-100 text-purple-600" :
                  "bg-blush-100 text-accent-pink"
                }`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800 text-sm">{template.title}</h4>
                    {rarity === "legendary" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-200 text-yellow-700 rounded-full font-medium">
                        Legendary
                      </span>
                    )}
                    {rarity === "rare" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full font-medium">
                        Rare
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{template.description}</p>
                  {template.options && template.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.options.map((opt, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">{template.monthlyLimit}/month</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditing(template)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                    disabled={isLoading}
                  >
                    <Edit3 size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                    disabled={isLoading}
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {templates.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-400">
          <Ticket size={48} className="mx-auto mb-2 opacity-50" />
          <p>No voucher templates yet</p>
          <p className="text-sm mt-1">Add your first redeemable voucher above</p>
        </div>
      )}
    </div>
  );
};

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "requests" | "notes" | "redeemables" | "cards" | "settings";

export const AdminDashboard = ({ isOpen, onClose }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("requests");
  const [requests, setRequests] = useState<CloudVoucherRequest[]>([]);
  const [notes, setNotes] = useState<CloudSharedNote[]>([]);
  const [counterDate, setCounterDate] = useState<string>("");
  const [counterMessage, setCounterMessage] = useState<string>("");
  const [showCounterForm, setShowCounterForm] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setIsLoading] = useState(false);

  // Load data from cloud storage
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cloudRequests, cloudNotes] = await Promise.all([
        fetchVoucherRequests(),
        fetchSharedNotes(),
      ]);
      setRequests(cloudRequests);
      setNotes(cloudNotes);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and polling for updates (30s)
  useEffect(() => {
    if (isOpen) {
      loadData();
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleApprove = async (id: string) => {
    await updateVoucherRequestStatus(id, "approved");
    await loadData();
  };

  const handleDeny = async (id: string) => {
    await removeVoucherRequest(id);
    await loadData();
  };

  const handleCounter = async (id: string) => {
    if (!counterDate) return;
    await updateVoucherRequestStatus(id, "counter-proposed", counterDate, counterMessage);
    setShowCounterForm(null);
    setCounterDate("");
    setCounterMessage("");
    await loadData();
  };

  const handleSendNote = async () => {
    if (!newNoteContent.trim()) return;
    await submitSharedNote(newNoteContent.trim(), "admin");
    setNewNoteContent("");
    await loadData();
  };

  const handleDeleteNote = async (id: string) => {
    await removeSharedNote(id);
    await loadData();
  };

  const handleMarkNoteRead = async (id: string) => {
    await markCloudNoteAsRead(id);
    await loadData();
  };

  const handleLogout = () => {
    clearAdminSession();
    onClose();
  };

  if (!isOpen) return null;

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const unreadNotesCount = notes.filter(n => n.from === "her" && !n.read).length;
  
  // Filter notes
  const notesFromHer = notes.filter(n => n.from === "her").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const notesFromAdmin = notes.filter(n => n.from === "admin").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const tabs = [
    { key: "requests" as Tab, label: "Requests", icon: Clock, badge: pendingCount },
    { key: "notes" as Tab, label: "Notes", icon: StickyNote, badge: unreadNotesCount },
    { key: "redeemables" as Tab, label: "Vouchers", icon: Ticket },
    { key: "cards" as Tab, label: "Cards", icon: CreditCard },
    { key: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-pink" />
              <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-full hover:bg-gray-100 transition-all ${isRefreshing ? "animate-spin" : ""}`}
                title="Refresh"
              >
                <RefreshCw size={18} className="text-gray-500" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="shrink-0 px-4 py-2 border-b border-gray-100 flex gap-1.5 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg
                    text-xs font-medium transition-all relative whitespace-nowrap
                    ${activeTab === tab.key
                      ? "bg-accent-pink text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon size={14} />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className={`
                      absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full flex items-center justify-center
                      ${activeTab === tab.key ? "bg-white text-accent-pink" : "bg-red-500 text-white"}
                    `}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "requests" && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Pending Voucher Requests
                </h3>
                
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Clock size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  requests.map(request => (
                    <motion.div
                      key={request.id}
                      layout
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${request.status === "approved" 
                          ? "border-green-200 bg-green-50" 
                          : request.status === "counter-proposed"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-gray-200 bg-white"
                        }
                      `}
                    >
                      {/* Request Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {request.voucherTitle}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {request.voucherType}
                          </p>
                        </div>
                        <span className={`
                          px-2 py-1 rounded-full text-[10px] font-semibold uppercase
                          ${request.status === "approved" 
                            ? "bg-green-100 text-green-700"
                            : request.status === "counter-proposed"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        `}>
                          {request.status === "counter-proposed" ? "Counter Sent" : request.status}
                        </span>
                      </div>

                      {/* Details */}
                      {request.requestedDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar size={14} />
                          <span>Requested: {new Date(request.requestedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {request.adminNote && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                          <MessageSquare size={14} className="mt-0.5 shrink-0" />
                          <span>"{request.adminNote}"</span>
                        </div>
                      )}

                      {/* Actions */}
                      {request.status === "pending" && (
                        <>
                          {showCounterForm === request.id ? (
                            <div className="space-y-3 pt-3 border-t border-gray-100">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Propose different date
                                </label>
                                <input
                                  type="date"
                                  value={counterDate}
                                  onChange={(e) => setCounterDate(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Message (optional)
                                </label>
                                <input
                                  type="text"
                                  value={counterMessage}
                                  onChange={(e) => setCounterMessage(e.target.value)}
                                  placeholder="How about this day instead?"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCounter(request.id)}
                                  disabled={!counterDate}
                                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                  Send Counter
                                </button>
                                <button
                                  onClick={() => setShowCounterForm(null)}
                                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                              >
                                <Check size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => setShowCounterForm(request.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                              >
                                <Calendar size={16} />
                                Counter
                              </button>
                              <button
                                onClick={() => handleDeny(request.id)}
                                className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                {/* Send note to her */}
                <div className="p-4 bg-accent-pink/10 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Send size={14} />
                    Send a note to her
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Write a sweet note..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      onKeyPress={(e) => e.key === "Enter" && handleSendNote()}
                    />
                    <button
                      onClick={handleSendNote}
                      disabled={!newNoteContent.trim()}
                      className="px-4 py-2 bg-accent-pink text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* Notes from her */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    Notes from her
                    {unreadNotesCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                        {unreadNotesCount} new
                      </span>
                    )}
                  </h3>
                  
                  {notesFromHer.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <StickyNote size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notes from her yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notesFromHer.map(note => (
                        <motion.div
                          key={note.id}
                          layout
                          className={`
                            p-3 rounded-lg border transition-all cursor-pointer
                            ${!note.read 
                              ? "border-accent-pink bg-accent-pink/5" 
                              : "border-gray-200 bg-gray-50"
                            }
                          `}
                          onClick={() => !note.read && handleMarkNoteRead(note.id)}
                        >
                          <p className="text-sm text-gray-700">{note.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                              {!note.read && (
                                <span className="text-[10px] text-accent-pink font-medium">NEW</span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes you sent */}
                {notesFromAdmin.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Notes you sent
                    </h3>
                    <div className="space-y-2">
                      {notesFromAdmin.map(note => (
                        <div
                          key={note.id}
                          className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                        >
                          <p className="text-sm text-gray-700">{note.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "redeemables" && (
              <RedeemablesManager />
            )}

            {activeTab === "cards" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Card Management
                  </h3>
                  <button className="px-3 py-1.5 bg-accent-pink text-white rounded-lg text-sm font-medium">
                    + Add Card
                  </button>
                </div>
                
                <div className="text-center py-8 text-gray-400">
                  <CreditCard size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Card management coming soon!</p>
                  <p className="text-sm mt-1">You'll be able to add, edit, and delete custom cards here.</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Admin Settings
                </h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-1">Reset PIN</h4>
                    <p className="text-sm text-gray-500 mb-3">Change your admin PIN</p>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                      Change PIN
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-1">Voucher Limits</h4>
                    <p className="text-sm text-gray-500 mb-3">Adjust monthly voucher limits</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Flowers:</span>
                        <span className="font-medium">1/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comfort:</span>
                        <span className="font-medium">2/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adventure:</span>
                        <span className="font-medium">1/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Movie:</span>
                        <span className="font-medium">2/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dinner:</span>
                        <span className="font-medium">2/mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl">
                    <h4 className="font-medium text-red-800 mb-1">Danger Zone</h4>
                    <p className="text-sm text-red-600 mb-3">Reset all data (cannot be undone)</p>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                      Reset Everything
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminDashboard;
