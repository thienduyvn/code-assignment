import { DataTable } from "./components/DataTable";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Assignment by Duy Vo
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Interactive data table with infinite scroll and inline editing
                capabilities
              </p>
            </div>
          </div>
        </div>

        <DataTable />
      </div>
    </div>
  );
}

export default App;
