import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MemberPopup({ open, onClose, member }) {
  const [remarkToggle, setRemarkToggle] = useState(false);
  const [adminToggle, setAdminToggle] = useState(false);
  const [remarkDate, setRemarkDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setRemarkToggle(member.remark === "मयत");
      setAdminToggle(Boolean(member.isAdmin));
      setRemarkDate(member.date || "");
    }
  }, [member]);

  if (!open || !member) return null;

  // 🔹 Convert yyyy-mm-dd ➜ dd/mm/yyyy
  const formatToDDMMYYYY = (date) => {
    if (!date) return "";
    if (date.includes("/")) return date; // already formatted
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    setLoading(true);

    const payload = {
      Remark: remarkToggle ? "मयत" : null,
      DOD: remarkToggle ? formatToDDMMYYYY(remarkDate) : null,
      isAdmin: adminToggle,
    };

    try {
      await axios.patch(`${apiUrl}/ID/${member.ID}`, payload);

      console.log("Updated member:", {
        ID: member.ID,
        ...payload,
      });
      onClose();
      toast.success("Updation successful !!");
    } catch (err) {
      console.error("Failed to update member", err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";

    const [day, month, year] = dob.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 mx-4 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Member Details
        </h2>

        {/* Info */}
        <div className="space-y-2 text-gray-700">
          <Info label="Name" value={member.Name} />
          <Info label="DOB" value={member.DOB} />
          <Info label="Age" value={calculateAge(member.DOB)} />
          <Info label="ID" value={member.ID} />
        </div>

        {/* Toggles */}
        {localStorage.getItem("admin") && (
          <div className="mt-6 space-y-4">
            <Toggle
              label="Remark as Deceased (मयत)"
              value={remarkToggle}
              onChange={setRemarkToggle}
              activeColor="bg-purple-500"
            />

            {/* 🔹 Date Field */}
            {remarkToggle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deceased Date*
                </label>
                <input
                  type="date"
                  value={remarkDate}
                  onChange={(e) => setRemarkDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600"
          >
            Cancel
          </button>

          {localStorage.getItem("admin") && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value ?? "-"}</span>
    </div>
  );
}

function Toggle({ label, value, onChange, activeColor }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          value ? activeColor : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
            value ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
