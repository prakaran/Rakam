import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

const Profile = () => {
  const { user } = useAuth();
  const authUser = user?.data?.user;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userAPI.getMe,
    onSuccess: (data) => {
      setFormData({
        ...formData,
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setSuccess("Profile updated successfully");
      setError("");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Update failed");
      setSuccess("");
      setLoading(false);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    const profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };
    setLoading(true);
    updateProfileMutation.mutate(profileData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Forms) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-8">
            <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Profile Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your personal information
              </p>
            </div>

            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm font-medium border border-emerald-100 dark:border-emerald-800/30">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-800/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder={authUser.firstName}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-white rounded-xl sm:text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder={authUser.lastName}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-white rounded-xl sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={authUser.email}
                  value={formData.email}
                  disabled
                  className="block w-full px-4 py-3 bg-gray-100/50 dark:bg-gray-900 dark:text-gray-500 border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-xl sm:text-sm cursor-not-allowed"
                />
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Change Password
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-white rounded-xl sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank if unchanged"
                      className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-white rounded-xl sm:text-sm transition-all"
                    />
                  </div>
                  {formData.newPassword && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-white rounded-xl sm:text-sm transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary-600 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-gray-100 disabled:opacity-50 transition-all text-sm shadow-sm"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (Info widget) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 sticky top-28">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-500 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
              Account Status
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-500 mb-1">Account ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                  {authUser?._id || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "long", day: "numeric" },
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Base Currency</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white inline-flex items-center">
                  <span>NPR (Nepalese Rupee)</span>
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Active Account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
