import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  useUsers,
  useToggleUserBlock,
  useDeleteUser,
} from "../../hooks/users/useUsers";
import { type UsersListParams } from "../../types/user";

const UserManagement = () => {
  const [params, setParams] = useState<UsersListParams>({
    page: 1,
    limit: 5,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Query hook
  const { data, isLoading, error, refetch } = useUsers(params);

  // Mutation hooks
  const { toggleBlock, isLoading: isToggling } = useToggleUserBlock();
  const deleteMutation = useDeleteUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "employee":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = () => {
    const newParams: UsersListParams = {
      ...params,
      page: 1,
    };

    if (searchTerm) newParams.search = searchTerm;
    if (roleFilter)
      newParams.role = roleFilter as "admin" | "employee" | "customer";
    if (statusFilter) newParams.status = statusFilter as "active" | "blocked";

    setParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setParams({
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleBlockUser = (userId: string, currentBlockStatus: boolean) => {
    toggleBlock(userId, currentBlockStatus);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(userId);
    }
  };

  const users = data?.users || [];
  const pagination = data?.pagination;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium">Error Loading Users</h3>
          <p className="text-red-600 mt-2">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-sm border rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage users, their roles, and account status
          </p>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="w-48">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className="w-48">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-500">
                        Loading users...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No users found</p>
                      <p className="mt-1">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.orderCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <MenuButton
                          className="inline-flex w-full justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                          disabled={isToggling || deleteMutation.isPending}
                        >
                          <EllipsisVerticalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </MenuButton>
                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <div className="py-1">
                            <MenuItem>
                              <button
                                onClick={() =>
                                  handleBlockUser(user._id, user.isBlocked)
                                }
                                disabled={isToggling}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden disabled:opacity-50"
                              >
                                {user.isBlocked ? (
                                  <>
                                    <LockOpenIcon
                                      className="mr-3 h-4 w-4"
                                      aria-hidden="true"
                                    />
                                    Unblock User
                                  </>
                                ) : (
                                  <>
                                    <LockClosedIcon
                                      className="mr-3 h-4 w-4"
                                      aria-hidden="true"
                                    />
                                    Block User
                                  </>
                                )}
                              </button>
                            </MenuItem>
                            <MenuItem>
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user._id,
                                    `${user.firstName} ${user.lastName}`
                                  )
                                }
                                disabled={deleteMutation.isPending}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 data-focus:bg-red-50 data-focus:text-red-900 data-focus:outline-hidden disabled:opacity-50"
                              >
                                <TrashIcon
                                  className="mr-3 h-4 w-4"
                                  aria-hidden="true"
                                />
                                Delete User
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-white border rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  {/* Actions Menu (Block/Delete) stays here */}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Role:</span> {user.role}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {user.isBlocked ? "Blocked" : "Active"}
                  </div>
                  <div>
                    <span className="font-medium">Orders:</span>{" "}
                    {user.orderCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(user.createdAt)}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Updated:</span>{" "}
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.totalCount
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalCount}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((pageNum) => {
                      const current = pagination.page;
                      return (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= current - 2 && pageNum <= current + 2)
                      );
                    })
                    .map((pageNum, index, array) => {
                      const showEllipsis =
                        index > 0 && pageNum - array[index - 1] > 1;
                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsis && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {(isToggling || deleteMutation.isPending) && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
