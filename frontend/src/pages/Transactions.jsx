import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionAPI } from "../services/api";
import Spinner from "../components/Spinner";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

const Transactions = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", user?._id, page],
    queryFn: () => transactionAPI.getTransactions(page, limit),
  });

  const transactions = transactionsData?.data?.data.transactions || [];
  const totalPages = transactionsData?.data?.data.totalPages || 1;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

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
        Failed to load transactions: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transaction History
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your recent transfers and deposits
        </p>
      </div>

      <div className="flex-1">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
              <InboxIcon className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transactions
            </h3>
            <p className="text-gray-500 max-w-sm text-sm">
              Your history is empty. Transfers and deposits will appear here
              once they occur.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {transactions.map((transaction) => {
              const isSent =
                transaction.type === "sent" || transaction.type === "TRANSFER";
              return (
                <li
                  key={transaction._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isSent
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            : "bg-primary-100/50 dark:bg-gray-800 text-primary-600 dark:text-gray-300"
                        }`}
                      >
                        {isSent ? (
                          <ArrowUpRightIcon className="w-5 h-5 stroke-2" />
                        ) : (
                          <ArrowDownLeftIcon className="w-5 h-5 stroke-2" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {isSent
                            ? `Sent to ${transaction.to?.firstName || "Unknown"} ${transaction.to?.lastName || ""}`
                            : `Received from ${transaction.from?.firstName || "System(Bhagyamani raixau timi)"} ${transaction.from?.lastName || ""}`}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span className="text-gray-300 dark:text-gray-700">
                            •
                          </span>
                          <span className="text-xs text-gray-500 max-w-[200px] truncate">
                            {transaction.description || "Transfer"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-base font-semibold ${isSent ? "text-gray-900 dark:text-gray-300" : "text-primary-600 dark:text-white"}`}
                      >
                        {isSent ? "-" : "+"} NPR{" "}
                        {formatAmount(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 capitalize font-medium">
                        {transaction.status || "Completed"}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {page}
            </span>{" "}
            of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
