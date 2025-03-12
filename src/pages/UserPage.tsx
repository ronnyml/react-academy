import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, CheckCircle, XCircle } from "lucide-react";
import BaseLayout from "@/layouts/BaseLayout";
import { getUsersData, User, UsersResponse } from "@/services/userService";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RoleFilterType = "all" | "admin" | "teacher" | "student";
type StatusFilterType = "all" | "active" | "inactive";

const ITEMS_PER_PAGE = 30;

const UserPage: React.FC = () => {
  const [currentFilteredPage, setCurrentFilteredPage] = useState<number>(1);
  const initialPage = 1;
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState<boolean>(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

  const { data, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: ["users", initialPage],
    queryFn: () => getUsersData(initialPage),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data) {
      setTotalUsers(data.totalUsers);
      
      if (data.users && data.totalPages > 1) {
        const fetchAllUsers = async () => {
          let allFetchedUsers: User[] = [...data.users];

          for (let page = 2; page <= data.totalPages; page++) {
            try {
              const pageData = await getUsersData(page);
              allFetchedUsers = [...allFetchedUsers, ...pageData.users];
            } catch (error) {
              console.error(`Error fetching page ${page}:`, error);
            }
          }
          
          setAllUsers(allFetchedUsers);
          setLoadingAllUsers(false);
        };
        
        fetchAllUsers();
      } else if (data.users && data.totalPages === 1) {
        setAllUsers(data.users);
        setLoadingAllUsers(false);
      }
    }
  }, [data]);

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

  const filteredUsers = useMemo(() => {
    const usersToFilter = loadingAllUsers && data?.users ? data.users : allUsers;

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
  }, [allUsers, data?.users, searchTerm, roleFilter, statusFilter, loadingAllUsers]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentFilteredPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentFilteredPage]);

  const totalFilteredPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  }, [filteredUsers]);

  useEffect(() => {
    setCurrentFilteredPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handlePageChange = (newPage: number): void => {
    setCurrentFilteredPage(newPage);
  };

  const renderPaginationItems = (): React.ReactNode => {
    const items: React.ReactNode[] = [];

    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentFilteredPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (currentFilteredPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = Math.max(2, currentFilteredPage - 1); i <= Math.min(totalFilteredPages - 1, currentFilteredPage + 1); i++) {
      if (i <= 1 || i >= totalFilteredPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentFilteredPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (currentFilteredPage < totalFilteredPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (totalFilteredPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalFilteredPages)}
            isActive={currentFilteredPage === totalFilteredPages}
          >
            {totalFilteredPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <p>Loading users data...</p>
        </div>
      </BaseLayout>
    );
  }

  if (isError || !data) {
    return (
      <BaseLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <p className="text-red-500">Error loading users data. Please try again later.</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <div className="text-sm mt-2 sm:mt-0">
            Showing <span className="font-medium">{paginatedUsers.length}</span> of{" "}
            <span className="font-medium">{filteredUsers.length}</span> filtered users
            {filteredUsers.length !== totalUsers && (
              <span> (Total: {totalUsers})</span>
            )}
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select 
                value={roleFilter} 
                onValueChange={(value) => setRoleFilter(value as RoleFilterType)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as StatusFilterType)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAllUsers && filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading all user data...
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleName(user.roleId)}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
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
                  <TableCell colSpan={5} className="text-center py-6">
                    No users found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentFilteredPage - 1))}
                  className={currentFilteredPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalFilteredPages, currentFilteredPage + 1))}
                  className={currentFilteredPage === totalFilteredPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </BaseLayout>
  );
};

export default UserPage;