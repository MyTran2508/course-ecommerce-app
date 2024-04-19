import { RoleType, User } from "@/types/user.type";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import ActionsCell from "@/components/Dialog/ActionCell";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course.type";
import FilterColumn from "./FilterColumn";

export const userColumns: ColumnDef<User>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) => (
      <div className="capitalize">
        {(row.original.roles as RoleType[])[0].id}
      </div>
    ),
  },
  {
    accessorKey: "removed",
    header: "Active",
    cell: ({ row }) => (
      <div className="capitalize flex-center">
        {row.getValue("removed") ? (
          <FaRegTimesCircle className="text-lg text-red-500" />
        ) : (
          <FaRegCheckCircle className="text-lg text-green-500" />
        )}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];

export const courseColumns: ColumnDef<Course>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: "Tên khóa học",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "isApproved",
    header: () => <FilterColumn name="isApproved" />,
    cell: ({ row }) => (
      <div className="capitalize ml-10">
        {row.getValue("isApproved") ? (
          <FaRegCheckCircle className="text-lg text-green-500" />
        ) : (
          <FaRegTimesCircle className="text-lg text-red-500" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "isAwaitingApproval",
    header: () => <FilterColumn name="isAwaitingApproval" />,
    cell: ({ row }) => (
      <div className="capitalize ml-10">
        {row.getValue("isAwaitingApproval") ? (
          <FaRegCheckCircle className="text-lg text-green-500" />
        ) : (
          <FaRegTimesCircle className="text-lg text-red-500" />
        )}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell course={row.original} />,
  },
];
