import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, CheckCircle, XCircle } from "lucide-react";
import BaseLayout from "@/layouts/BaseLayout";
import { getUsersData } from "@/services/userService";
import { User, UsersResponse } from "@/types/dataTypes";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationComponent } from "@/components/Pagination";

type RoleFilterType = "all" | "admin" | "teacher" | "student";
type StatusFilterType = "all" | "active" | "inactive";

const ITEMS_PER_PAGE = 30;

const UserPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState<boolean>(true);

  const { data: initialUsersResponse, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: ["users", currentPage],
    queryFn: () => getUsersData(currentPage),
  });

  useEffect(() => {
    if (initialUsersResponse) {
      if (initialUsersResponse.totalPages > 1) {
        const fetchAllUsers = async () => {
          let allFetchedUsers: User[] = [...initialUsersResponse.users];
          for (let page = 1; page <= initialUsersResponse.totalPages; page++) {
            if (page !== currentPage) {
              const cachedData = queryClient.getQueryData<UsersResponse>(["users", page]);
              if (cachedData) {
                allFetchedUsers = [...allFetchedUsers, ...cachedData.users];
              } else {
                const pageData = await queryClient.fetchQuery({
                  queryKey: ["users", page],
                  queryFn: () => getUsersData(page),
                });
                allFetchedUsers = [...allFetchedUsers, ...pageData.users];
              }
            }
          }
          setAllUsers(allFetchedUsers);
          setLoadingAllUsers(false);
        };
        fetchAllUsers();
      } else {
        setAllUsers(initialUsersResponse.users);
        setLoadingAllUsers(false);
      }
    }
  }, [initialUsersResponse, currentPage, queryClient]);

  useEffect(() => {
    if (initialUsersResponse && currentPage < initialUsersResponse.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["users", currentPage + 1],
        queryFn: () => getUsersData(currentPage + 1),
      });
    }
    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: ["users", currentPage - 1],
        queryFn: () => getUsersData(currentPage - 1),
      });
    }
  }, [currentPage, initialUsersResponse, queryClient]);

  const filteredUsers = useMemo(() => {
    const usersToFilter = loadingAllUsers && initialUsersResponse?.users ? initialUsersResponse.users : allUsers;
    return usersToFilter.filter((user: User) => {
      const matchesSearch =
        searchTerm === "" ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && user.roleId === 1) ||
        (roleFilter === "teacher" && user.roleId === 2) ||
        (roleFilter === "student" && user.roleId === 3);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, initialUsersResponse?.users, searchTerm, roleFilter, statusFilter, loadingAllUsers]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)),
    [filteredUsers]
  );

  const totalUsers = useMemo(
    () => initialUsersResponse?.totalUsers || 0,
    [initialUsersResponse]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Teacher";
      case 3:
        return "Student";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-[#1E3A8A]">Users</h1>
          <p className="text-[#1E3A8A]">Loading users data...</p>
        </div>
      </BaseLayout>
    );
  }

  if (isError || !initialUsersResponse) {
    return (
      <BaseLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-[#1E3A8A]">Users</h1>
          <p className="text-red-500">Error loading users data. Please try again later.</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Users</h1>
          <div className="text-sm mt-2 sm:mt-0 text-[#1E3A8A]">
            Showing <span className="font-semibold">{paginatedUsers.length}</span> of{" "}
            <span className="font-semibold">{filteredUsers.length}</span> filtered users
            {filteredUsers.length !== totalUsers && (
              <span> (Total: <span className="font-semibold">{totalUsers}</span>)</span>
            )}
          </div>
        </div>

        <div className="mb-6 space-y-4 bg-white shadow-sm rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#1E3A8A]" />
              <Input
                placeholder="Search users..."
                className="pl-10 py-2 border-[#1E3A8A]/20 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/40 text-[#1E3A8A] placeholder:text-[#1E3A8A]/60 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as RoleFilterType)}
              >
                <SelectTrigger className="w-32 border-[#1E3A8A]/20 text-[#1E3A8A] focus:ring-[#1E3A8A]/40 bg-white rounded-md">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#1E3A8A]/20">
                  <SelectItem value="all" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">All Roles</SelectItem>
                  <SelectItem value="admin" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Admin</SelectItem>
                  <SelectItem value="teacher" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Teacher</SelectItem>
                  <SelectItem value="student" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilterType)}
              >
                <SelectTrigger className="w-32 border-[#1E3A8A]/20 text-[#1E3A8A] focus:ring-[#1E3A8A]/40 bg-white rounded-md">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#1E3A8A]/20">
                  <SelectItem value="all" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">All Status</SelectItem>
                  <SelectItem value="active" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Active</SelectItem>
                  <SelectItem value="inactive" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-[#1E3A8A]/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]">
                <TableHead className="text-white font-semibold py-3">Name</TableHead>
                <TableHead className="text-white font-semibold py-3">Email</TableHead>
                <TableHead className="text-white font-semibold py-3">Role</TableHead>
                <TableHead className="text-white font-semibold py-3">Created</TableHead>
                <TableHead className="text-white font-semibold py-3 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAllUsers && filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-[#1E3A8A]">
                    Loading all user data...
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user: User, index) => (
                  <TableRow
                    key={user.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#1E3A8A]/5"
                    } hover:bg-[#1E3A8A]/10 transition-colors`}
                  >
                    <TableCell className="font-medium text-[#1E3A8A] py-3">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="text-[#1E3A8A] py-3">{user.email}</TableCell>
                    <TableCell className="text-[#1E3A8A] py-3">{getRoleName(user.roleId)}</TableCell>
                    <TableCell className="text-[#1E3A8A] py-3">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-center py-3">
                      {user.active ? (
                        <CheckCircle className="h-5 w-5 text-green-500 inline" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 inline" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-[#1E3A8A]">
                    No users found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </BaseLayout>
  );
};

export default UserPage;