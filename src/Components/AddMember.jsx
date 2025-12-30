import { use, useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function AddMember({ members = [] }) {
  const [formData, setFormData] = useState({
    title: "Mr.",
    name: "",
    dob: "",
    village: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  // Unique village list
  const villageOptions = [
    ...new Set(members.map((m) => m.Village).filter(Boolean).sort((a, b) => a.localeCompare(b))),
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get next ID safely
  const getLastID = () => {
    if (members.length === 0) return 1;
    const lastID = members[members.length - 1].ID;
    return parseInt(lastID) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dob || !formData.village) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const nextID = getLastID();
      const today = new Date().toLocaleDateString("en-GB");

      const payload = {
        data: [
          {
            ID: nextID,
            Name: `${formData.title} ${formData.name}`,
            DOB: formData.dob,
            Village: formData.village,
            Email: formData.email || "",
            RegistrationDate: today,
          },
        ],
      };

      await axios.post(
        apiUrl,
        payload
      );

      setSuccess("Member added successfully");

      // Update local members (no re-fetch)
      setMembers([...members, payload.data[0]]);

      setFormData({
        title: "Mr.",
        name: "",
        dob: "",
        village: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      {localStorage.getItem("admin") ? <>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Title inline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Name *
            </label>
            <div className="flex gap-2">
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                >
                <option>Mr.</option>
                <option>Mrs.</option>
                <option>Miss</option>
              </select>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Village *
            </label>
            <select
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
              <option value="">Select Village</option>
              {villageOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
            {loading ? "Saving..." : "Add Member"}
          </button>

          {success && (
            <p className="text-green-600 text-sm mt-2">{success}</p>
          )}
        </form>
      </> : <div className="text-center text-red-600 m-4 text-xl">You are not an Admin !!</div>}
    </div>
  );
}
