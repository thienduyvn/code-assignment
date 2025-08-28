import { create } from "zustand";

interface ApiRecord {
  id: string;
  name: string;
  language: string;
  bio: string;
  version: number;
}

export interface PersonRecord {
  id: string;
  name: string;
  language: string;
  bio: string;
  version: number;
  state: "new customer" | "served" | "to contact" | "paused";
  createdDate: string;
}

// Store state type - what data we keep in memory
interface DataStore {
  // The data
  records: PersonRecord[];

  apiCache: ApiRecord[];
  isCacheLoaded: boolean;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;

  // Pagination config
  pageSize: number;
  currentPage: number;
  hasMoreData: boolean;

  // Search and Sort
  searchTerm: string;
  sortField: keyof PersonRecord | null;
  sortDirection: "asc" | "desc" | null;

  // Actions
  loadInitialData: () => Promise<void>;
  loadMoreData: () => Promise<void>;
  updateRecord: (id: string, updates: Partial<PersonRecord>) => void;
  addNewRecord: () => string; // Returns the new record ID
  deleteRecord: (id: string) => void;
  setPageSize: (size: number) => void; // Configure how many items to load
  setSearchTerm: (term: string) => void;
  setSorting: (field: keyof PersonRecord, direction: "asc" | "desc") => void;
  clearSorting: () => void;
  resetStore: () => void;
}

// Helper function to create random data for demo
const getRandomState = (): PersonRecord["state"] => {
  const states: PersonRecord["state"][] = [
    "new customer",
    "served",
    "to contact",
    "paused",
  ];
  return states[Math.floor(Math.random() * states.length)];
};

const getRandomDate = (): string => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split("T")[0];
};

// Helper function to filter and sort records
const processRecords = (
  allRecords: PersonRecord[],
  searchTerm: string,
  sortField: keyof PersonRecord | null,
  sortDirection: "asc" | "desc" | null
): PersonRecord[] => {
  let processed = [...allRecords];

  // Apply search filter
  if (searchTerm.trim()) {
    const search = searchTerm.toLowerCase();
    processed = processed.filter(
      (record) =>
        record.name.toLowerCase().includes(search) ||
        record.bio.toLowerCase().includes(search) ||
        record.language.toLowerCase().includes(search) ||
        record.state.toLowerCase().includes(search) ||
        record.id.toLowerCase().includes(search) ||
        record.version.toString().includes(search)
    );
  }

  // Apply sorting
  if (sortField && sortDirection) {
    processed.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }

  return processed;
};

// Our simple data store
export const useDataStore = create<DataStore>((set, get) => ({
  // Initial state
  records: [],
  apiCache: [],
  isCacheLoaded: false,
  isLoading: false,
  isLoadingMore: false,
  pageSize: 30, // Increased to better fill the view
  currentPage: 0,
  hasMoreData: true,

  // Search and Sort state
  searchTerm: "",
  sortField: null,
  sortDirection: null,

  // Load first batch of data
  loadInitialData: async () => {
    set({ isLoading: true });

    try {
      const { apiCache, isCacheLoaded, pageSize } = get();

      // Only fetch from API if we haven't cached it yet
      let dataToUse = apiCache;
      if (!isCacheLoaded) {
        console.log("Fetching data from API (one time only)...");
        const response = await fetch(
          "https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json"
        );
        dataToUse = await response.json();

        // Cache the data for future use
        set({ apiCache: dataToUse, isCacheLoaded: true });
        console.log(
          `Cached ${dataToUse.length} records for efficient pagination`
        );
      } else {
        console.log("Using cached data - no API call needed!");
      }

      // Transform data to PersonRecord format
      const allPersonRecords: PersonRecord[] = dataToUse.map(
        (item: ApiRecord) => ({
          id: item.id,
          name: item.name,
          language: item.language,
          bio: item.bio,
          version: item.version,
          state: getRandomState(),
          createdDate: getRandomDate(),
        })
      );

      // Apply search and sort, then take first page
      const { searchTerm, sortField, sortDirection } = get();
      const processedRecords = processRecords(
        allPersonRecords,
        searchTerm,
        sortField,
        sortDirection
      );
      const initialRecords = processedRecords.slice(0, pageSize);

      set({
        records: initialRecords,
        currentPage: 1,
        hasMoreData: processedRecords.length > pageSize,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load data:", error);
      set({ isLoading: false });
    }
  },

  // Load more data for infinite scroll
  loadMoreData: async () => {
    const {
      isLoadingMore,
      hasMoreData,
      currentPage,
      apiCache,
      pageSize,
      searchTerm,
      sortField,
      sortDirection,
      records,
    } = get();

    // Don't load if already loading or no more data
    if (isLoadingMore || !hasMoreData) {
      console.log(
        "Skipping loadMoreData: isLoadingMore =",
        isLoadingMore,
        "hasMoreData =",
        hasMoreData
      );
      return;
    }

    console.log(
      `Loading more data - Current records: ${records.length}, Page: ${currentPage}, PageSize: ${pageSize}`
    );

    // Add a small delay to prevent aggressive loading
    await new Promise((resolve) => setTimeout(resolve, 300));

    set({ isLoadingMore: true });

    try {
      console.log(
        `Loading page ${currentPage + 1} from cache (${pageSize} items)...`
      );

      // Transform all cached data
      const allPersonRecords: PersonRecord[] = apiCache.map(
        (item: ApiRecord) => ({
          id: item.id,
          name: item.name,
          language: item.language,
          bio: item.bio,
          version: item.version,
          state: getRandomState(),
          createdDate: getRandomDate(),
        })
      );

      // Apply search and sort to all records
      const processedRecords = processRecords(
        allPersonRecords,
        searchTerm,
        sortField,
        sortDirection
      );

      // Calculate which records to get
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const newRecords = processedRecords.slice(startIndex, endIndex);

      set((state) => ({
        records: [...state.records, ...newRecords],
        currentPage: currentPage + 1,
        hasMoreData: endIndex < processedRecords.length,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.error("Failed to load more data:", error);
      set({ isLoadingMore: false });
    }
  },

  // Update a single record (for inline editing)
  updateRecord: (id: string, updates: Partial<PersonRecord>) => {
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      ),
    }));
  },

  // Add a new empty record
  addNewRecord: () => {
    const newId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newRecord: PersonRecord = {
      id: newId,
      name: "New Customer",
      language: "Sindhi",
      bio: "Please edit this bio...",
      version: 1.0,
      state: "new customer",
      createdDate: new Date().toISOString().split("T")[0],
    };

    set((state) => ({
      records: [newRecord, ...state.records],
    }));

    return newId;
  },

  // Delete a record (useful for canceling new records)
  deleteRecord: (id: string) => {
    set((state) => ({
      records: state.records.filter((record) => record.id !== id),
    }));
  },

  // Configure page size (how many items to load at once)
  setPageSize: (size: number) => {
    set({ pageSize: size });
    console.log(`Page size updated to ${size} items per load`);
  },

  // Search functionality
  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 0 });
    // Trigger a reload with the new search term
    get().loadInitialData();
  },

  // Sorting functionality
  setSorting: (field: keyof PersonRecord, direction: "asc" | "desc") => {
    set({ sortField: field, sortDirection: direction, currentPage: 0 });
    // Trigger a reload with the new sorting
    get().loadInitialData();
  },

  // Clear sorting
  clearSorting: () => {
    set({ sortField: null, sortDirection: null, currentPage: 0 });
    // Trigger a reload without sorting
    get().loadInitialData();
  },

  // Reset everything
  resetStore: () => {
    set({
      records: [],
      apiCache: [],
      isCacheLoaded: false,
      isLoading: false,
      isLoadingMore: false,
      pageSize: 20,
      currentPage: 0,
      hasMoreData: true,
      searchTerm: "",
      sortField: null,
      sortDirection: null,
    });
  },
}));
