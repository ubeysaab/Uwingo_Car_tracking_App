import { vehicleRepairService } from "@/api/services/vehicleRepairService";
import { VehicleRepairApplicationT } from "@/types/comingData/vehicleRepair";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetVehicleRepair = () => {
  return useQuery({
    queryKey: ["vehicleRepair"],
    queryFn: vehicleRepairService.getAll,
  });
};

export const useDeleteVehicleRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => vehicleRepairService.delete(id),
    onSuccess: () => {
      // Refetch the list to show the item was removed
      queryClient.invalidateQueries({ queryKey: ["vehicleRepair"] });
    },
  });
};

export const useUpdateVehicleRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Using the Interface instead of 'any' for better IntelliSense
    mutationFn: (data: Partial<VehicleRepairApplicationT>) =>
      vehicleRepairService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleRepair"] });
    },
  });
};

export const useCreateVehicleRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VehicleRepairApplicationT>) =>
      vehicleRepairService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleRepair"] });
    },
  });
};