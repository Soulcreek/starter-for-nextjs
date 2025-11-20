"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [collection1Data, setCollection1Data] = useState([]);
  const [collection2Data, setCollection2Data] = useState([]);
  const [collection1Name, setCollection1Name] = useState("");
  const [collection2Name, setCollection2Name] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const collection1Id = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_1_ID;
      const collection2Id = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_2_ID;
      const col1Name = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_1_NAME || "Collection 1";
      const col2Name = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_2_NAME || "Collection 2";
      
      setCollection1Name(col1Name);
      setCollection2Name(col2Name);

      // Check if IDs are configured
      if (
        !databaseId ||
        !collection1Id ||
        !collection2Id ||
        databaseId.includes("your-") ||
        collection1Id.includes("your-") ||
        collection2Id.includes("your-")
      ) {
        setError(
          "Database/Collection IDs not configured. Please update your .env file with actual Appwrite IDs."
        );
        setLoading(false);
        return;
      }

      // Fetch data from both collections (SDK v18 uses positional args)
      const [data1, data2] = await Promise.all([
        databases.listDocuments(databaseId, collection1Id),
        databases.listDocuments(databaseId, collection2Id),
      ]);

      setCollection1Data(data1.documents);
      setCollection2Data(data2.documents);
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFB]">
        <div className="text-[#56565C]">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFB] p-5">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-7xl">
        <div className="flex items-center justify-between rounded-lg border border-[#EBEBEB] bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#19191C]">Dashboard</h1>
            <p className="text-[#56565C]">Welcome back, {user.name}!</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-md border border-[#EBEBEB] bg-white px-4 py-2 font-medium text-[#19191C] transition-colors hover:bg-[#FAFAFB]"
            >
              Template Page
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md bg-[#FD366E] px-4 py-2 font-medium text-white transition-colors hover:bg-[#E02D5E]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-auto mb-6 max-w-7xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
            <p className="mt-2 text-xs text-red-500">
              Go to your Appwrite Console -> Databases to find your Database ID
              and Collection IDs, then update the .env file.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[#56565C]">Loading data...</p>
        </div>
      )}

      {/* Data Display */}
      {!loading && !error && (
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Collection 1 */}
          <div className="rounded-lg border border-[#EBEBEB] bg-white shadow-sm">
            <div className="border-b border-[#EBEBEB] p-6">
              <h2 className="text-xl font-semibold text-[#19191C]">
                {collection1Name}
              </h2>
              <p className="text-sm text-[#56565C]">
                {collection1Data.length} documents
              </p>
            </div>
            <div className="p-6">
              {collection1Data.length === 0 ? (
                <p className="text-[#56565C]">No documents found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#EBEBEB]">
                        <th className="pb-3 pr-4 text-left text-sm font-semibold text-[#19191C]">
                          ID
                        </th>
                        <th className="pb-3 px-4 text-left text-sm font-semibold text-[#19191C]">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {collection1Data.map((doc) => (
                        <tr key={doc.$id} className="border-b border-[#EBEBEB]">
                          <td className="py-3 pr-4 text-sm text-[#56565C]">
                            {doc.$id}
                          </td>
                          <td className="py-3 px-4">
                            <pre className="max-w-2xl overflow-x-auto text-xs text-[#56565C]">
                              {JSON.stringify(
                                Object.fromEntries(
                                  Object.entries(doc).filter(
                                    ([key]) => !key.startsWith("$")
                                  )
                                ),
                                null,
                                2
                              )}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Collection 2 */}
          <div className="rounded-lg border border-[#EBEBEB] bg-white shadow-sm">
            <div className="border-b border-[#EBEBEB] p-6">
              <h2 className="text-xl font-semibold text-[#19191C]">
                {collection2Name}
              </h2>
              <p className="text-sm text-[#56565C]">
                {collection2Data.length} documents
              </p>
            </div>
            <div className="p-6">
              {collection2Data.length === 0 ? (
                <p className="text-[#56565C]">No documents found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#EBEBEB]">
                        <th className="pb-3 pr-4 text-left text-sm font-semibold text-[#19191C]">
                          ID
                        </th>
                        <th className="pb-3 px-4 text-left text-sm font-semibold text-[#19191C]">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {collection2Data.map((doc) => (
                        <tr key={doc.$id} className="border-b border-[#EBEBEB]">
                          <td className="py-3 pr-4 text-sm text-[#56565C]">
                            {doc.$id}
                          </td>
                          <td className="py-3 px-4">
                            <pre className="max-w-2xl overflow-x-auto text-xs text-[#56565C]">
                              {JSON.stringify(
                                Object.fromEntries(
                                  Object.entries(doc).filter(
                                    ([key]) => !key.startsWith("$")
                                  )
                                ),
                                null,
                                2
                              )}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
