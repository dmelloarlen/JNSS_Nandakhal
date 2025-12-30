import {
  Users,
  UserPlus,
  Cake,
} from "lucide-react";
import OptionCard from "./ui/OptionCard";

export default function Home() {
  const options = [
    {
      title: "View Upcomming Birthday's",
      desc: "",
      icon: <Cake size={48} />,
      color: "bg-purple-700",
      path: "/upcoming",
    },
    {
      title: "Village-wise Data",
      desc: "View members village by village",
      icon: <Users size={48} />,
      color: "bg-blue-700",
      path: "/info",
    },
    {
      title: "Add Member",
      desc: "Register a new senior citizen",
      icon: <UserPlus size={48} />,
      color: "bg-green-700",
      path: "/add",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="text-center py-6">
        <p className="text-2xl font-semibold">Select an option below</p>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((item, index) => (
            <OptionCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
}
