import React, { useEffect, useMemo, useState } from "react";
import getAllUsers from "./curd.jsx";
import { saveUpdate } from "./curd.jsx";

const Table = () => {
  const [search, setSearch] = useState("");

  const [dummyCustomers, setDummyCustomers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setDummyCustomers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const [editingIndex, setEditingIndex] = useState(null);
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEdit = (e, index) => {
    e.preventDefault();
    setEditingIndex(index);
    console.log(index);
    setEmail(dummyCustomers[index].email);
  };

  const handleSave = async (e, index) => {
    e.preventDefault();
    const updatedCustomers = [...dummyCustomers];
    updatedCustomers[index].email = email;
    setDummyCustomers(updatedCustomers);
    const res = await saveUpdate(updatedCustomers[index]);
    console.log(res);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const data = useMemo(() => {
    return dummyCustomers.filter((cus) =>
      cus.customerName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, dummyCustomers]);
  console.log(data);

  return (
    <div className="w-full border rounded-sm border-gray-800">
      <div className="flex items-center justify-between w-100">
        <h1 className="ml-3 font-semibold text-lg text-gray-700">
          Search Customer
        </h1>
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="m-2 px-3 py-2 border border-gray-300"
          value={search}
        />
      </div>
      <table className="w-full border border-collapse ">
        <thead className="bg-gray-100 sticky top-20">
          <tr className="">
            <th className="border border-gray-300 px-3 py-2 text-left">
              Customer Name
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Primary Number
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Alternate Number
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Loyalty Points
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Country
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              State
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Pincode
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Company
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Status
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Updated On
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{c.customerName}</td>
              <td className="border px-3 py-2">{c.Pc}</td>
              <td className="border px-3 py-2">{c.Ac}</td>
              <td className="border px-3 py-2">
                {editingIndex == index ? (
                  <div>
                    <input
                      className="px-3 py-2 border border-gray-500"
                      onChange={(e) => handleChange(e)}
                      value={email}
                    ></input>
                  </div>
                ) : (
                  c.email
                )}
              </td>
              <td className="border px-3 py-2">{c.loyaltyPoints}</td>
              <td className="border px-3 py-2">{c.country}</td>
              <td className="border px-3 py-2">{c.state}</td>
              <td className="border px-3 py-2">{c.pincode}</td>
              <td className="border px-3 py-2">{c.company}</td>
              <td className="border px-3 py-2">{c.Status}</td>
              <td className="border px-3 py-2">{c.updatedOn}</td>
              <td className="border px-3 py-2">
                {editingIndex === index ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleSave(e, index)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2 "
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleEdit(e, index)}
                    className="bg-blue-400 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
