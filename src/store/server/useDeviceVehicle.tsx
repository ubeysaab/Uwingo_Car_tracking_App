import { DeviceVehiclesService } from "@/api/services/deviceVehicleService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// useQueryClient is a custom hook that returns the current QueryClient instance.







export const useGetDeviceVehicles = () => {
  return useQuery({
    queryKey: ["DeviceVehicles"], // This is the "ID" of this data in the cache
    queryFn: DeviceVehiclesService.getAll,
    refetchOnReconnect: true,
    retry: 0,
    networkMode: "always"
  });
};

export const useDeleteDeviceVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => DeviceVehiclesService.delete(id),
    onSuccess: () => {
      // This tells React Query to refetch the list automatically!
      queryClient.invalidateQueries({ queryKey: ["DeviceVehicles"] });
    },
  });
};
export const useUpdateDeviceVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn only takes ONE argument, so we destructure an object
    mutationFn: (data: any) =>
      DeviceVehiclesService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DeviceVehicles"] });
    },
  });
};

export const useCreateDeviceVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => DeviceVehiclesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DeviceVehicles"] });
    },
  });
};