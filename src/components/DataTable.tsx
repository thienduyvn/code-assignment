import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditableCell } from "@/components/EditableCell";
import { StatusBadge } from "@/components/StatusBadge";
import { useDataStore, type PersonRecord } from "@/store/dataStore";
import {
  Plus,
  ArrowUpDown,
  Search,
  MoreHorizontal,
  RefreshCw,
  Download,
  Share,
  X,
} from "lucide-react";

interface DataTableProps {
  className?: string;
}

export function DataTable({ className }: DataTableProps) {
  // Local state for UI controls
  const [showSearch, setShowSearch] = useState(false);

  // Get everything we need from the store
  const {
    records,
    isLoading,
    hasMoreData,
    searchTerm,
    sortField,
    sortDirection,
    loadInitialData,
    loadMoreData,
    updateRecord,
    addNewRecord,
    deleteRecord,
    setSearchTerm,
    setSorting,
    clearSorting,
  } = useDataStore();

  // Load data when component mounts
  useEffect(() => {
    if (records.length === 0) {
      loadInitialData();
    }
  }, [records.length, loadInitialData]);

  // Simple update function for inline editing
  const handleCellUpdate = (
    id: string,
    field: keyof PersonRecord,
    value: string | number
  ) => {
    updateRecord(id, { [field]: value });
  };

  // Add new row function
  const handleAddRow = () => {
    const newId = addNewRecord();
    console.log(`Added new row with ID: ${newId}`);
  };

  // Delete row function (for new rows)
  const handleDeleteRow = (id: string) => {
    deleteRecord(id);
  };

  // Check if a record is newly created (has temp ID)
  const isNewRecord = (id: string) => id.startsWith("temp_");

  // Handle column sorting
  const handleSort = (field: keyof PersonRecord) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction or clear
      if (sortDirection === "asc") {
        setSorting(field, "desc");
      } else {
        clearSorting();
      }
    } else {
      // Sort by new field, start with ascending
      setSorting(field, "asc");
    }
  };

  // Handle search toggle
  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch && searchTerm) {
      setSearchTerm(""); // Clear search when hiding
    }
  };

  // Get sort icon for column header
  const getSortIcon = (field: keyof PersonRecord) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />
    ) : (
      <ArrowUpDown className="h-3 w-3 text-blue-600" />
    );
  };

  // Simple validation functions
  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return "Name is required";
    }
    if (value.length < 2) {
      return "Name must be at least 2 characters";
    }
    return null;
  };

  const validateVersion = (value: string): string | null => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return "Version must be a number";
    }
    if (num < 0) {
      return "Version must be positive";
    }
    return null;
  };

  // Show loading screen while initial data loads
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-0 ${className}`}>
      {/* Table Header - matches the screenshot design */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        {/* Left side - Table name with back arrow */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <span className="font-medium text-gray-900">
            Assignment by Duy Vo
          </span>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleAddRow}>
            <Plus className="h-4 w-4 mr-1" />
            Add row
          </Button>

          <Button variant="outline" size="sm">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </Button>

          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Sort
          </Button>

          <Button variant="outline" size="sm" onClick={handleSearchToggle}>
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>

          <Button variant="outline" size="sm">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Fields
          </Button>

          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            Ask AI
          </Button>
        </div>
      </div>

      {/* Search and Sort Controls - Hidden by default, shown when buttons are clicked */}
      {(showSearch || searchTerm) && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8"
              autoFocus={showSearch}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setShowSearch(false);
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Sort Status */}
      {sortField && (
        <div className="px-4 py-2 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              Sorted by <strong>{sortField}</strong> ({sortDirection}ending)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSorting}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        <InfiniteScroll
          dataLength={records.length}
          next={loadMoreData}
          hasMore={hasMoreData}
          loader={
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Loading more data...</span>
              </div>
            </div>
          }
          endMessage={
            <div className="flex items-center justify-center py-4">
              <div className="text-gray-500 text-sm">
                All {records.length} records loaded
              </div>
            </div>
          }
          height={600}
          className="overflow-auto"
        >
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-12 bg-gray-50 font-medium text-gray-700">
                  <span className="text-xs">📋</span> ID
                </TableHead>
                <TableHead
                  className="w-48 bg-gray-50 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("bio")}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="text-xs">📝</span> bio
                    </span>
                    {getSortIcon("bio")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-32 bg-gray-50 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="text-xs">#</span> name
                    </span>
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-32 bg-gray-50 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("language")}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="text-xs">🌐</span> language
                    </span>
                    {getSortIcon("language")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-20 bg-gray-50 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("version")}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="text-xs">📊</span> version
                    </span>
                    {getSortIcon("version")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-32 bg-gray-50 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("state")}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="text-xs">📍</span> State
                    </span>
                    {getSortIcon("state")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-32 bg-gray-50 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("createdDate")}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="text-xs">📅</span> Created Date
                    </span>
                    {getSortIcon("createdDate")}
                  </div>
                </TableHead>
                <TableHead className="w-12 bg-gray-50"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => {
                const isNewRow = isNewRecord(record.id);
                return (
                  <TableRow
                    key={`${record.id}-${index}`}
                    className={`hover:bg-gray-50 border-b border-gray-100 h-16 ${
                      isNewRow ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <TableCell className="font-mono text-xs text-gray-600 py-3">
                      {isNewRow ? (
                        <span className="text-blue-600 font-medium">NEW</span>
                      ) : (
                        `${record.id.slice(0, 8)}...`
                      )}
                    </TableCell>
                    <TableCell className="max-w-48 py-3">
                      <EditableCell
                        value={record.bio}
                        field="bio"
                        onSave={(value) =>
                          handleCellUpdate(record.id, "bio", value)
                        }
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <EditableCell
                        value={record.name}
                        field="name"
                        onSave={(value) =>
                          handleCellUpdate(record.id, "name", value)
                        }
                        validation={validateName}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <EditableCell
                        value={record.language}
                        field="language"
                        onSave={(value) =>
                          handleCellUpdate(record.id, "language", value)
                        }
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <EditableCell
                        value={record.version}
                        field="version"
                        onSave={(value) =>
                          handleCellUpdate(record.id, "version", value)
                        }
                        validation={validateVersion}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <StatusBadge status={record.state} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-600 py-3">
                      {record.createdDate}
                    </TableCell>
                    <TableCell className="py-3">
                      {isNewRow ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteRow(record.id)}
                          title="Delete new row"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Add new row placeholder */}
              <TableRow
                className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer group"
                onClick={handleAddRow}
              >
                <TableCell className="py-3 text-center" colSpan={8}>
                  <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-blue-600 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Click to add new row</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
