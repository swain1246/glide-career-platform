import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Check, X, Ban, Eye } from "lucide-react";
import { TableCell, TableRow } from "./ui/table";

interface AdminUserRowProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "student" | "company" | "mentor";
    status: "pending" | "approved" | "rejected" | "banned";
    avatar?: string;
    joinedAt: string;
    lastActive?: string;
  };
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onBan: (userId: string) => void;
  onView: (userId: string) => void;
}

export function AdminUserRow({ user, onApprove, onReject, onBan, onView }: AdminUserRowProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    await action();
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      banned: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      student: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      company: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      mentor: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };

    return (
      <Badge className={colors[role as keyof typeof colors] || colors.student}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        {getRoleBadge(user.role)}
      </TableCell>

      <TableCell>
        {getStatusBadge(user.status)}
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {formatDate(user.joinedAt)}
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {user.lastActive ? formatDate(user.lastActive) : "Never"}
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-2">
          {user.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => handleAction(() => onApprove(user.id))}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction(() => onReject(user.id))}
                disabled={isLoading}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border shadow-lg">
              <DropdownMenuItem 
                onClick={() => onView(user.id)}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              
              {user.status === "approved" && (
                <DropdownMenuItem 
                  onClick={() => handleAction(() => onBan(user.id))}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User
                </DropdownMenuItem>
              )}
              
              {user.status === "banned" && (
                <DropdownMenuItem 
                  onClick={() => handleAction(() => onApprove(user.id))}
                  className="cursor-pointer text-green-600 dark:text-green-400"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Unban User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}