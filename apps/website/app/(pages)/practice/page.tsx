"use client";

import { useEffect, useState } from "react";
import { MockTestCard } from "@/components/features/practice/mock-test-card";
import { mockTestsService } from "@/services/mock-tests.service";
import type { MockTest } from "@/types/mock-test";

export default function PracticePage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    mockTestsService.getAll()
      .then((tests) => {
        if (!cancelled) {
          setMockTests(tests);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load mock tests:", err);
          setError("Failed to load practice tests. Please try again.");
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#121212]">Practice Tests</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Sharpen your skills with our curated mock tests. Track your progress and improve over time.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[280px] rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#121212] text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Mock Tests Grid */}
      {!isLoading && !error && (
        <>
          {mockTests.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockTests.map((test) => (
                <MockTestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium">No practice tests available</p>
              <p className="text-sm mt-1">Check back later for new tests!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}