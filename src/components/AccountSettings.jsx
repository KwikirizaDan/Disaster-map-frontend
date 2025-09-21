import React, { useState } from "react";

const AccountSettings = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated info:", form);
    alert("Account updated successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="flex justify-center py-10">
        <div className="w-full max-w-5xl px-4">
          <h1 className="text-4xl font-bold">Account Settings</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your personal information and reported incidents.
          </p>

          {/* Personal Information */}
          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your name, email, and password.
              </p>
            </div>
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  className="form-input w-full"
                  placeholder="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  className="form-input w-full"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  className="form-input w-full"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-500 px-3 py-2 text-white font-semibold"
                >
                  Update Information
                </button>
              </form>
            </div>
          </div>

          {/* Reported Incidents */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold">Reported Incidents</h2>
            <p className="mt-1 text-sm text-gray-600">
              View and manage the disaster incidents you have reported.
            </p>

            <div className="mt-6 overflow-x-auto rounded-md border bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Incident Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm">Flood</td>
                    <td className="px-6 py-4 text-sm">Riverdale, CA</td>
                    <td className="px-6 py-4 text-sm">2024-03-15</td>
                    <td className="px-6 py-4 text-sm text-green-600">Resolved</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <a href="#" className="text-blue-500">
                        View Details
                      </a>
                    </td>
                  </tr>
                  {/* You can map over API data here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
