// hooks/use-mock-tests.ts
import { useQuery } from "@tanstack/react-query";
import { mockTestsService } from "@/services/mock-tests.service";

export function useMockTests() {
  return useQuery({
    queryKey: ["mock-tests"],
    queryFn: mockTestsService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMockTest(id: string) {
  return useQuery({
    queryKey: ["mock-test", id],
    queryFn: () => mockTestsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
