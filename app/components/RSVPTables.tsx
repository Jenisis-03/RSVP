"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react"; // Import a search icon for the filter input
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface RSVP {
  id: string;
  name: string;
  email: string;
  accompany: number;
  attendence: string;
}

interface RSVPTableProps {
  data: RSVP[];
  isLoading?: boolean; // Optional prop to indicate loading state
}

export function RSVPTable({ data, isLoading }: RSVPTableProps) {
  const [filter, setFilter] = React.useState("");

  // Memoized filtered data to prevent unnecessary recalculations
  const filteredData = React.useMemo(() => {
    return data?.filter((rsvp) =>
      rsvp.name?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  return (
    <div className="rounded-2xl border bg-white shadow-lg overflow-hidden">
      {/* Filter Input */}
      <div className="flex items-center p-4 sm:p-6 bg-gray-50">
        <div className="relative w-full max-w-sm sm:max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-12 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">
                Email
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">
                Guests
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                Attending
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton Loader for Loading State
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-8 rounded-md" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredData?.length > 0 ? (
              // Render Data Rows
              filteredData.map((rsvp) => (
                <TableRow
                  key={rsvp.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Stacked Layout for Small Screens */}
                  <TableCell className="sm:hidden py-4">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800">{rsvp.name}</p>
                      <p className="text-gray-600">{rsvp.email}</p>
                      <p className="text-gray-600">Guests: {rsvp.accompany || "-"}</p>
                      <div className="text-center">
                        {rsvp.attendence === "yes" ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm">
                            Yes
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium text-sm">
                            No
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  {/* Normal Layout for Larger Screens */}
                  <TableCell className="hidden sm:table-cell py-4 font-medium text-gray-800">
                    {rsvp.name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-600">
                    {rsvp.email}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-600">
                    {rsvp.accompany || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {rsvp.attendence === "yes" ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm">
                        Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium text-sm">
                        No
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No Results Row
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <p className="text-gray-500 text-lg font-medium">
                    No results found.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}