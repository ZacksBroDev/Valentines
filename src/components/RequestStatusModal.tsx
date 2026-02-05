// ============================================================
// REQUEST STATUS MODAL
// Shows the girlfriend approved/counter-proposed voucher requests
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import { 
  Check, 
  Calendar, 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { 
  VoucherRequest,
  getRequestsForUser,
  updateRequestStatus,
} from "../utils/sharedStorage";

interface RequestStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestStatusModal = ({ isOpen, onClose }: RequestStatusModalProps) => {
  const [requests, setRequests] = useState<VoucherRequest[]>([]);

  const loadRequests = useCallback(() => {
    setRequests(getRequestsForUser());
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadRequests();
    }
  }, [isOpen, loadRequests]);

  const handleAcceptCounter = (id: string) => {
    updateRequestStatus(id, "approved");
    loadRequests();
  };

  const handleDeclineCounter = (id: string) => {
    updateRequestStatus(id, "denied");
    loadRequests();
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const counterProposed = requests.filter(r => r.status === "counter-proposed");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Requests">
      <div className="space-y-4">
        {/* Counter-proposed (action needed) */}
        {counterProposed.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-yellow-600 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Calendar size={14} />
              New Date Proposed
            </h3>
            {counterProposed.map(request => (
              <motion.div
                key={request.id}
                layout
                className="p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50 mb-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {request.voucherTitle}
                  </h4>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-semibold rounded-full uppercase">
                    Counter
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{request.selectedOption}</p>
                
                <div className="flex items-center gap-2 text-sm text-yellow-700 mb-2">
                  <Calendar size={14} />
                  <span>
                    He suggested: <strong>{request.counterDate && new Date(request.counterDate).toLocaleDateString()}</strong>
                  </span>
                </div>
                
                {request.counterMessage && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                    <MessageSquare size={14} className="mt-0.5 shrink-0" />
                    <span>"{request.counterMessage}"</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-3 border-t border-yellow-200">
                  <button
                    onClick={() => handleAcceptCounter(request.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineCounter(request.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    <XCircle size={16} />
                    Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Clock size={14} />
              Waiting for Approval
            </h3>
            {pendingRequests.map(request => (
              <motion.div
                key={request.id}
                layout
                className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 mb-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {request.voucherTitle}
                  </h4>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded-full uppercase">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-600">{request.selectedOption}</p>
                {request.requestedDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Calendar size={14} />
                    <span>Requested: {new Date(request.requestedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* No requests */}
        {requests.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">No pending requests</p>
            <p className="text-gray-400 text-sm mt-1">
              Redeem a voucher to see it here
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RequestStatusModal;
