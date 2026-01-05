import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleService } from "@/api/services/vehicles/vehiclesService";

// useQueryClient is a custom hook that returns the current QueryClient instance.







export const useGetVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"], // This is the "ID" of this data in the cache
    queryFn: VehicleService.getAll,
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VehicleService.delete(id),
    onSuccess: () => {
      // This tells React Query to refetch the list automatically!
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn only takes ONE argument, so we destructure an object
    mutationFn: (data: any) =>
      VehicleService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => VehicleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};