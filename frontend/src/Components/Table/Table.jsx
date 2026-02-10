import React, { useEffect, useMemo, useState } from "react";
import getAllUsers from "../../api/curd.js";
import { saveUpdate, Login, checkLogin } from "../../api/curd.js";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import LoginPage from "../../Pages/Login.jsx";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slice/authSlice.js";

const Table = () => {
  const dispatach = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [dummyCustomers, setDummyCustomers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState(null);
  //const [company, setCompany] = useState("");
  const [sortType, setSortType] = useState("");
  const [att, setAtt] = useState(null);
  const [Email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //if(!user.role === 'admin') return;
        const response = await getAllUsers();
        setDummyCustomers(response);
        const user = await checkLogin();
        console.log(user);
        if (user) {
          dispatach(login(user));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e, f) => {
    //setCompany(e.target.value);
    setEditedCustomer({...editedCustomer, [f]: e.target.value});
  };

  const handleEdit = (e, index) => {
    e.preventDefault();
    setEditingIndex(index);
    console.log(index);
    setEditedCustomer({...dummyCustomers[index]})
    //setCompany(dummyCustomers[index].company);
  };

  const handleSave = async (e, index) => {
    e.preventDefault();
    const updatedCustomers = [...dummyCustomers];
    updatedCustomers[index] = editedCustomer;
    setDummyCustomers(updatedCustomers);
    const res = await saveUpdate(editedCustomer, user.id);
    console.log(res);
    setEditingIndex(null);
    setEditedCustomer(null)
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const data = useMemo(() => {
    let filtered = dummyCustomers.filter((cus) =>
      [cus.customerName, cus.Pc, cus.Ac, cus.email, cus.company]
        .filter(Boolean)
        .some((field) =>
          field.toString().toLowerCase().includes(search.toLowerCase()),
        ),
    );

    if (att === "Pc" || att === "Ac") {
      if (sortType === "asc") {
        filtered.sort((a, b) => a[att] - b[att]);
      }

      if (sortType === "dsc") {
        filtered.sort((a, b) => b[att] - a[att]);
      }
    } else {
      if (sortType === "asc") {
        filtered.sort((a, b) => a[att].localeCompare(b[att]));
      }

      if (sortType === "dsc") {
        filtered.sort((a, b) => b[att].localeCompare(a[att]));
      }
    }

    return filtered;
  }, [search, dummyCustomers, sortType, att]);

  const handleSort = (sType, field) => {
    setSortType(sType);
    setAtt(field);
  };

  const handleLogin = async () => {
    try {
      const user = await Login(Email, password);
      console.log(user);
      dispatach(login(user));
    } catch (e) {
      console.log(e);
      setError("Invalid Email or Password");
    }
  };

  const renderEditableCell = (value, field, index) => {
  if (editingIndex === index && field !== "email" && field !== "updatedOn") {
    return (
      <input
        className="border px-2 py-1"
        value={editedCustomer[field]}
        onChange={(e) => handleChange(e, field)}
      />
    );
  }
  return value;
};


  return (
    <div>
      {!isAuthenticated ? (
        <LoginPage
          error={error}
          handleLogin={handleLogin}
          Email={Email}
          setemail={setemail}
          password={password}
          setPassword={setPassword}
        />
      ) : user?.role == "admin" ? (
        <div className="w-full border rounded-sm border-gray-600 overflow-auto">
          <div className="flex items-center justify-between w-100 gap-2 sticky left-0 bg-white">
            <h1 className="text-nowrap ml-2 font-semibold text-lg text-gray-700">
              Search Customer
            </h1>
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="m-2 px-3 py-2 border border-gray-300"
              value={search}
            />
          </div>
          <table className="w-full border ">
            <thead className="bg-gray-100 sticky top-0 ">
              <tr className="">
                <th className="border border-gray-300 px-3 py-2 text-left">
                  <div className="flex gap-1">
                    <p className="">Customer Name</p>
                    <FiArrowUp
                      onClick={() => handleSort("asc", "customerName")}
                      className="bg-red-200"
                    />
                    <FiArrowDown
                      onClick={() => handleSort("dsc", "customerName")}
                      className="bg-cyan-500"
                    />
                  </div>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  <div className="flex gap-1">
                    <p className="">Primary Number</p>
                    <FiArrowUp
                      onClick={() => handleSort("asc", "Pc")}
                      className="bg-red-200"
                    />
                    <FiArrowDown
                      onClick={() => handleSort("dsc", "Pc")}
                      className="bg-cyan-500"
                    />
                  </div>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  <div className="flex gap-1">
                    <p className="">Alternate Number</p>
                    <FiArrowUp
                      onClick={() => handleSort("asc", "Ac")}
                      className="bg-red-200"
                    />
                    <FiArrowDown
                      onClick={() => handleSort("dsc", "Ac")}
                      className="bg-cyan-500"
                    />
                  </div>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  <div className="flex gap-1">
                    <p>Email</p>
                    <FiArrowUp
                      onClick={() => handleSort("asc", "email")}
                      className="bg-red-200"
                    />
                    <FiArrowDown
                      onClick={() => handleSort("dsc", "email")}
                      className="bg-cyan-200"
                    />
                  </div>
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
                  <div className="flex gap-1">
                    <p>Company</p>
                    <FiArrowUp
                      onClick={() => handleSort("asc", "company")}
                      className="bg-red-200"
                    />
                    <FiArrowDown
                      onClick={() => handleSort("dsc", "company")}
                      className="bg-cyan-200"
                    />
                  </div>
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
                <tr key={index} className="hover:bg-gray-200">
                  <td className="border px-3 py-2">{renderEditableCell(c.customerName, "customerName", index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.Pc, "Pc", index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.Ac, 'Ac', index)}</td>
                  <td className="border px-3 py-2">{c.email}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.loyaltyPoints, 'loyaltyPoints', index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.country, "country", index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.state, 'state', index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.pincode, 'pincode', index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.company, 'company', index)}</td>
                  <td className="border px-3 py-2">{renderEditableCell(c.Status, 'Status', index)}</td>
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
      ) : (
        user && (
          <div>
            <h1 className="text-center font-semibold mt-10 text-[20px] text-blue-500">
              Welcome to the profile!
            </h1>
          </div>
        )
      )}
    </div>
  );
};

export default Table;
