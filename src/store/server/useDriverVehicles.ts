import { DriverVehiclesService } from "@/api/services/driverVehicles/driverVehiclesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// useQueryClient is a custom hook that returns the current QueryClient instance.







export const useGetDriverVehicles = () => {
  return useQuery({
    queryKey: ["driverVehicles"], // This is the "ID" of this data in the cache
    queryFn: DriverVehiclesService.getAll,
    refetchOnReconnect: true,
    retry: 0,
    networkMode: "always"
  });
};

export const useDeleteDriverVehicles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => DriverVehiclesService.delete(id),
    onSuccess: () => {
      // This tells React Query to refetch the list automatically!
      queryClient.invalidateQueries({ queryKey: ["driverVehicles"] });
    },
  });
};
export const useUpdateDriverVehicles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn only takes ONE argument, so we destructure an object
    mutationFn: (data: any) =>
      DriverVehiclesService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverVehicles"] });
    },
  });
};

export const useCreateDriverVehicles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => DriverVehiclesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverVehicles"] });
    },
  });
};