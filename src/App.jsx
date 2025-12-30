import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import MembersInfo from "./Components/MembersInfo";
import AddMember from "./Components/AddMember";
import UpcommingBirthdays from "./Components/UpcommingBirthdays";
import { ArrowBigLeftDash, LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { timeBasedGreetingToast } from "./Components/ui/greetingToast";
// import Reports from "./components/Reports";
// import Help from "./components/Help";
const adminPassword = import.meta.env.VITE_ADMIN_PASS;
const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [tempValue, setTempValue] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [members, setMembers] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    timeBasedGreetingToast()
    axios
      .get(apiUrl)
      .then((response) => {
        setMembers(response.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (tempValue.trim() === "") {
      toast.error("Please enter a password !!");
      return;
    }
    if (tempValue === adminPassword) {
      localStorage.setItem("admin", "true");
      setPopupOpen(false);
      navigate('/')
      window.location.reload();
      toast.success("Login Successful!");
    }else {
      toast.error("Incorrect Password, Try Again!");
      setTempValue("");
    }
  };

  return (
    <>
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="flex justify-between bg-slate-500 text-2xl px-4 py-2 cursor-pointer">
          <ArrowBigLeftDash size={30} onClick={() => window.history.back()} />
          {localStorage.getItem("admin") ? (
            <div className="flex text-xl" 
                onClick={() => {
                  localStorage.removeItem("admin");
                  window.location.reload();
                }}>
              Logout
              <LogOut
                size={30}/>
            </div>
          ) : (
            <div className="flex text-xl" onClick={() => setPopupOpen(true)}>
              Login
              <LogIn size={30} />
            </div>
          )}
        </div>
        <div className="py-4">
          <h1 className="text-4xl font-bold text-center">
            Jeshta Nagrik Seva Sangha
          </h1>
          <p className="text-2xl text-center mt-2">
            Holy Sprit Church, Nandakhal
          </p>
        </div>

        {popupOpen && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 mx-4 relative">
            {/* Close */}
            <button
              onClick={() => setPopupOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Authenticate
            </h2>

            <form onSubmit={handleSubmit2}>
              <label className="text-black mb-6">Enter Password :</label>
              <input
                type="text"
                placeholder="Enter Password"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full rounded-lg border text-black border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6 hover:bg-blue-700"
                >
                Submit
              </button>
            </form>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setPopupOpen(false)}
                className="px-4 py-2 rounded-lg border text-gray-600"
                >
                Cancel
              </button>
            </div>
          </div>
        </div>}
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<MembersInfo members={members} />} />
        <Route path="/add" element={<AddMember members={members} />} />
        <Route path="/upcoming" element={<UpcommingBirthdays members={members} />} />
        {/* <Route path="/reports" element={<Reports />} />
        <Route path="/help" element={<Help />} /> */}
      </Routes>
    </>
  );
}
