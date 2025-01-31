import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "../store/slices/productSlice";
import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlusIcon,
  ChartBarIcon,
  CubeIcon,
  TagIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormData = {
    name: "",
    brand: "",
    description: "",
    price: "",
    size: [],
    stock: "",
    images: [],
    category: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      dispatch(fetchProductsStart());
      const { data } = await getProducts();
      dispatch(fetchProductsSuccess(data));
    } catch (error) {
      dispatch(
        fetchProductsFailure(
          error.response?.data?.message || "Failed to fetch products"
        )
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "size") {
      setFormData({
        ...formData,
        [name]: value
          .split(",")
          .map(Number)
          .filter((size) => !isNaN(size)),
      });
    } else if (name === "price" || name === "stock") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else if (type === "file") {
      setFormData({
        ...formData,
        images: Array.from(files),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "size") {
          formDataToSend.append(key, formData[key].join(","));
        } else if (key === "images") {
          formData[key].forEach((image, index) => {
            formDataToSend.append("images", image);
          });
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEditing) {
        await updateProduct(editingProduct._id, formDataToSend);
      } else {
        await createProduct(formDataToSend);
      }
      fetchProducts();
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingProduct(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      size: product.size,
      stock: product.stock,
      images: product.images || [],
      category: product.category,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <p className="mt-1 text-gray-500">
                Manage your products and view store statistics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  Sales: $12,450
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg">
                <CubeIcon className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Products: {products.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Navigation */}
        <div className="flex space-x-4 mb-8">
          <Link
            to="/dashboard"
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-md"
          >
            <TagIcon className="h-5 w-5 mr-2" />
            Products
          </Link>
          <Link
            to="/customers"
            className="flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Customers
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h2>
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingProduct(null);
                    setFormData(initialFormData);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size.join(",")}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Images
                </label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {formData.images.length > 0 ? (
                      formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              image instanceof File
                                ? URL.createObjectURL(image)
                                : image
                            }
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages.splice(index, 1);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="images"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500">
                    You can select multiple images
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <PencilIcon className="h-5 w-5" />
                    <span>Update Product</span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Product List
            </h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.image
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-primary font-medium">
                          ${product.price}
                        </span>
                        <span className="text-gray-500">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
};

export default Dashboard;
