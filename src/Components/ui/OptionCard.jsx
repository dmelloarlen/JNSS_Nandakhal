import { useNavigate } from "react-router-dom";

export default function OptionCard({ title, desc, icon, color, path }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="w-full bg-white rounded-2xl shadow-xl p-8 flex items-center gap-6
                 hover:scale-105 transition border-4 border-gray-200
                 focus:ring-4 focus:ring-blue-400"
    >
      <div className={`${color} p-6 rounded-xl text-white`}>
        {icon}
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-gray-700">{desc}</p>
      </div>
    </button>
  );
}
