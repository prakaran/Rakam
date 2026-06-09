import { useQuery } from "@tanstack/react-query";
import { accountAPI } from "../services/api";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { PaperAirplaneIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    data: balanceData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["balance", user?._id],
    queryFn: accountAPI.getBalance,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
        Failed to load balance: {error.message}
      </div>
    );
  }

  const balance = balanceData?.data?.data.balance || 0;
  const balanceInNPR = (balance / 100).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-2 bg-primary-600 dark:bg-white rounded-2xl p-8 shadow-sm text-white dark:text-black flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-gray-400 dark:text-gray-500 font-medium text-sm tracking-wide uppercase mb-2">
              Available Balance
            </h2>
            <div className="text-5xl font-bold tracking-tight">
              <span className="text-2xl font-semibold opacity-70 mr-1">NPR</span>
              {balanceInNPR}
            </div>
          </div>
          {/* Decorative circle */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white/10 dark:bg-black/5 pointer-events-none" />
        </div>

        {/* Quick Stats side */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col justify-center space-y-6">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
            <div className="flex items-center text-sm font-semibold capitalize text-gray-900 dark:text-white">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              Active Account
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Currency</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">NPR</div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
          <Link
            to="/send"
            className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-white dark:group-hover:text-black transition-colors text-gray-600 dark:text-gray-300">
                <PaperAirplaneIcon className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Send Money</h3>
                <p className="text-sm text-gray-500 mt-1">Transfer funds instantly</p>
              </div>
            </div>
          </Link>

          <Link
            to="/transactions"
            className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-white dark:group-hover:text-black transition-colors text-gray-600 dark:text-gray-300">
                <ArrowsRightLeftIcon className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Transactions</h3>
                <p className="text-sm text-gray-500 mt-1">View your recent history</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
