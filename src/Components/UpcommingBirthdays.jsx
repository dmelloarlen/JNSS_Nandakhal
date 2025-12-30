import { useMemo, useState } from "react";
import Dropdown from "../Components/ui/DropDown";

function parseDOB(dobString) {
  if (!dobString) return null;
  const [day, month, year] = dobString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export default function UpcommingBirthdays({members = []}) {
  const [selectedVillage, setSelectedVillage] = useState("All");

  const today = new Date();
  const currentMonth = today.getMonth();
  const todayDate = today.getDate();

  const villageOptions = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          members
            .map((m) => m.Village)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
        )
      ),
    ];
  }, [members]);

  const filteredMembers = members.filter((member) => {
    if (member.Remark === "मयत") return false;

    if (selectedVillage === "All") {
      return true;
    }else{
      return member.Village === selectedVillage;
    }
  });

  const todaysBirthdays = useMemo(() => {
    return filteredMembers
      .map((m) => {
        const dob = parseDOB(m.DOB);
        if (!dob) return null;

        return {
          ...m,
          birthdayMonth: dob.getMonth(),
          birthdayDate: dob.getDate(),
        };
      })
      .filter(Boolean)
      .filter(
        (m) => m.birthdayMonth === currentMonth && m.birthdayDate === todayDate
      );
  }, [members, selectedVillage]);

  const monthlyBirthdays = useMemo(() => {
    return filteredMembers
      .filter((m) =>
        selectedVillage === "All" ? true : m.Village === selectedVillage
      )
      .map((m) => {
        const dob = parseDOB(m.DOB);
        if (!dob) return null;

        const birthdayThisYear = new Date(
          today.getFullYear(),
          dob.getMonth(),
          dob.getDate()
        );

        const status = birthdayThisYear < today ? "past" : "upcoming";

        return {
          ...m,
          birthdayMonth: dob.getMonth(),
          birthdayDate: dob.getDate(),
          status,
        };
      })
      .filter(Boolean)
      .filter(
        (m) => m.birthdayMonth === currentMonth && m.birthdayDate !== todayDate
      )
      .sort((a, b) => {
        if (a.status === b.status) {
          return a.birthdayDate - b.birthdayDate;
        }
        return a.status === "upcoming" ? -1 : 1;
      });
  }, [members, selectedVillage]);

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
    <div className="p-3 lg:p-8 space-y-8">
      {villageOptions.length > 0 && <Dropdown
        label="Select Village"
        options={villageOptions}
        onSelect={setSelectedVillage}
      />}

      {todaysBirthdays.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl lg:text-3xl font-bold">🎉 Birthdays Today</h2>

          {todaysBirthdays.map((m, index) => (
            <div
              key={index}
              className="border-l-4 border-b-4 border-blue-700 bg-blue-100 rounded-xl p-4 lg:p-6"
            >
              <h3 className="text-xl font-semibold text-blue-900">{m.Name}</h3>

              <p className="text-lg text-gray-800">
                Village: <span className="font-medium">{m.Village}</span>
              </p>

              <div className="mt-2 inline-block text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Age: {calculateAge(m.DOB)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-2xl lg:text-3xl font-bold">
          📅 Birthdays This Month
        </h2>

        {monthlyBirthdays.length === 0 ? (
          <p className="text-xl font-semibold">No birthdays found</p>
        ) : (
          <div className="grid gap-4">
            {monthlyBirthdays.map((m, index) => (
              <div
                key={index}
                className={`border-l-4 border-b-4 rounded-xl p-4 lg:p-6
                ${
                  m.status === "past"
                    ? "border-yellow-600 bg-yellow-100"
                    : "border-green-700 bg-green-100"
                }`}
              >
                <div className="text-xl font-bold">{m.Name}</div>
                <div className="text-lg">Village: {m.Village}</div>
                <div className="text-lg">
                  🎂 {m.birthdayDate}{" "}
                  {today.toLocaleString("default", {
                    month: "long",
                  })}
                </div>
                <div className="font-bold mt-1">Age: {calculateAge(m.DOB)}</div>

                <div className="font-bold mt-1">
                  {m.status === "past" ? "⏳ Already Gone" : "✅ Upcoming"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
