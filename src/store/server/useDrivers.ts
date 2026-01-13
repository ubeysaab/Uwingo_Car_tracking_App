import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// useQueryClient is a custom hook that returns the current QueryClient instance.

import { DriverService } from "@/api/services/drivers/driversService";





export const useGetDrivers = () => {
  return useQuery({
    queryKey: ["drivers"], // This is the "ID" of this data in the cache
    queryFn: DriverService.getAll,
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => DriverService.delete(id),
    onSuccess: () => {
      // This tells React Query to refetch the list automatically!
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};
export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn only takes ONE argument, so we destructure an object
    mutationFn: (data: any) =>
      DriverService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => DriverService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};