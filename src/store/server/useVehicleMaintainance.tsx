import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehicleMaintenanceService } from "@/api/services/vehicleMaintenanceService";
import { VehicleMaintenanceApplicationT } from "@/types/comingData/vehicleMaintenance";
export const useGetVehicleMaintenances = () => {
  return useQuery({
    queryKey: ["vehicleMaintenances"],
    queryFn: vehicleMaintenanceService.getAll,
  });
};

export const useDeleteVehicleMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => vehicleMaintenanceService.delete(id),
    onSuccess: () => {
      // Refetch the list to show the item was removed
      queryClient.invalidateQueries({ queryKey: ["vehicleMaintenances"] });
    },
  });
};

export const useUpdateVehicleMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Using the Interface instead of 'any' for better IntelliSense
    mutationFn: (data: Partial<VehicleMaintenanceApplicationT>) =>
      vehicleMaintenanceService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleMaintenances"] });
    },
  });
};

export const useCreateVehicleMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VehicleMaintenanceApplicationT>) =>
      vehicleMaintenanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleMaintenances"] });
    },
  });
};