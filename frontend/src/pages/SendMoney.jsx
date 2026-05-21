import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI, transactionAPI } from "../services/api";
import Spinner from "../components/Spinner";

const SendMoney = () => {
  const [formData, setFormData] = useState({
    to: "",
    amount: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const queryClient = useQueryClient();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userAPI.getUsers,
  });

  const transferMutation = useMutation({
    mutationFn: transactionAPI.transfer,
    onSuccess: () => {
      queryClient.invalidateQueries(["balance"]);
      queryClient.invalidateQueries(["transactions"]);
      setSuccess("Money sent successfully!");
      setFormData({ to: "", amount: "", description: "" });
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Transfer failed");
      setLoading(false);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const amountInPaisa = Math.round(parseFloat(formData.amount) * 100);

    transferMutation.mutate({
      to: formData.to,
      amount: amountInPaisa,
      description: formData.description,
    });
  };

  const users = usersData?.data?.data?.users || [];
  const currentUser = users.find(
    (user) => user.email === "current@example.com",
  ); // In full app this would be driven by Auth context accurately

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-8">
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Send Money
          </h1>
          <p className="text-sm text-gray-500 mt-1">Initiate a transfer to another user</p>
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
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient
            </label>
            <select
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 rounded-xl sm:text-sm transition-all"
              required
            >
              <option value="">Select a user</option>
              {users
                .filter((user) => user.email !== "current@example.com")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (NPR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rs.</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="1"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 rounded-xl sm:text-sm transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 rounded-xl sm:text-sm transition-all resize-none"
              placeholder="What is this for?"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || usersLoading}
              className="w-full flex justify-center py-3.5 px-4 bg-primary-600 dark:bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 dark:focus:ring-primary-500 disabled:opacity-50 transition-all text-sm"
            >
              {loading ? "Processing..." : "Finish Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMoney;
