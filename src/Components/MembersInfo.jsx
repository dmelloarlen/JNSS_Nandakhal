import React, { useState } from "react";
import Dropdown from "./ui/DropDown";
import MemberPopup from "./ui/MemberPopup";

export default function MembersInfo({members = [] }) {
  const [selectedVillage, setSelectedVillage] = useState();
  const [popup, setPopup] = useState({ state: false, data: null });
  
  const villageOptions = [
    ...Array.from(
      new Set(
        members
        .map((member) => member.Village)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
      )
    ),
  ];
  
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

  const filteredMembers = members.filter((member) => {
    if (member.Remark === "मयत") return false;

    if (member.Village !== selectedVillage) {
      return false;
    }

    return true;
  });

  const findMember = (id) => {
    const member = members.find((m) => String(m.ID) === String(id));

    if (!member) {
      return { exists: false };
    }
    return {
      exists: true,
      member,
    };
  };

  return (
    <div>
      <div className="p-4 lg:p-10 space-y-4">
        <Dropdown
          label="Select Village"
          options={villageOptions}
          onSelect={(value) => setSelectedVillage(value)}
        />
        <hr />
      </div>

      {selectedVillage ? (
        <>
          <div className="overflow-x-auto m-2 lg:m-8">
            {selectedVillage && (
              <div className="text-xl lg:text-2xl mb-3 lg:text-left">
                Total Members in{" "}
                <span className="font-bold">{selectedVillage}</span>:{" "}
                <span className="font-bold">{filteredMembers.length}</span>
              </div>
            )}

            {selectedVillage && (
              <div className="min-w-[700px] lg:min-w-0">
                <table className="w-full border-4 border-blue-800 rounded-xl lg:text-xl">
                  <thead className="bg-blue-800 text-white">
                    <tr>
                      <th className="border-2 px-2 py-3 lg:px-4 lg:py-4">
                        Sr.
                      </th>
                      <th className="border-2 px-2 py-3 lg:px-4 lg:py-4">
                        Member ID
                      </th>
                      <th className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                        Name
                      </th>
                      <th className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                        Village
                      </th>
                      <th className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                        DOB
                      </th>
                      <th className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                        Age
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-lg lg:text-2xl font-semibold"
                        >
                          No records found
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member, index) => (
                        <tr
                          key={index}
                          className="even:bg-gray-100 hover:bg-blue-100 cursor-pointer"
                          onClick={() =>
                            setPopup({
                              state: true,
                              data: findMember(member.ID).member,
                            })
                          }
                        >
                          <td className="border-2 px-2 py-3 lg:px-4 lg:py-4">
                            {index + 1}
                          </td>
                          <td className="border-2 px-2 py-3 lg:px-4 lg:py-4">
                            {member.ID}
                          </td>
                          <td className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                            {member.Name}
                          </td>
                          <td className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                            {member.Village}
                          </td>
                          <td className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                            {member.DOB}
                          </td>
                          <td className="border-2 px-3 py-3 lg:px-6 lg:py-4">
                            {calculateAge(member.DOB)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">Please Select an village</div>
      )}
      {popup.data && (
        <MemberPopup
          open={popup.state}
          onClose={() => setPopup({ state: false, data: null })}
          member={popup.data}
        />
      )}
    </div>
  );
}
