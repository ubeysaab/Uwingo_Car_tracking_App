import { vehicleDetailsService } from "@/api/services/vehicleDetails";
import { useQuery } from "@tanstack/react-query";
export const useGetVehicleDetails = (id: string | number) => {
  return useQuery({
    // Adding the id here makes the query unique to that specific vehicle
    queryKey: ["vehicleDetails", id],

    // queryKey is the second element of the array in the context
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return vehicleDetailsService.getAllDetailsOfVehicle(id);
    },
  });
};