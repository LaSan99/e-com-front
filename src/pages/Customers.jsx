import { useState, useEffect } from "react";
import { getCustomers, updateCustomer, deleteCustomer } from "../services/api";
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const initialFormData = {
    name: "",
    email: "",
    role: "customer",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await getCustomers();
      setCustomers(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(editingCustomer._id, formData);
      fetchCustomers();
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingCustomer(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update customer");
    }
  };

  const handleEdit = (customer) => {
    setIsEditing(true);
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      role: customer.role,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete customer");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isEditing && (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Update Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingCustomer(null);
                    setFormData(initialFormData);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={isEditing ? "md:col-span-1" : "md:col-span-2"}>
          <h2 className="text-xl font-bold mb-4">Customer List</h2>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
              >
                <div className="flex items-center">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div className="ml-4">
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-gray-600">{customer.email}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        customer.role === "manager"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {customer.role}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
