import { vehicleInspectionService } from "@/api/services/vehicleInspectionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VehicleInspectionApplicationT } from "@/types/comingData/vehicleInspection";
export const useGetVehicleInspection = () => {
  return useQuery({
    queryKey: ["vehicleInspection"],
    queryFn: vehicleInspectionService.getAll,
  });
};

export const useDeleteVehicleInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => vehicleInspectionService.delete(id),
    onSuccess: () => {
      // Refetch the list to show the item was removed
      queryClient.invalidateQueries({ queryKey: ["vehicleInspection"] });
    },
  });
};

export const useUpdateVehicleInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Using the Interface instead of 'any' for better IntelliSense
    mutationFn: (data: Partial<VehicleInspectionApplicationT>) =>
      vehicleInspectionService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleInspection"] });
    },
  });
};

export const useCreateVehicleInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VehicleInspectionApplicationT>) =>
      vehicleInspectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleInspection"] });
    },
  });
};