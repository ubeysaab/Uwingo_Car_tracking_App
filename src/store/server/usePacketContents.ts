import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PacketContentsService } from "@/api/services/packetContentsService";
// useQueryClient is a custom hook that returns the current QueryClient instance.


export const useGetPacketContents = () => {
  return useQuery({
    queryKey: ["packetContents"], // This is the "ID" of this data in the cache
    queryFn: PacketContentsService.getAll,
  });
};

export const useDeletePacketContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => PacketContentsService.delete(id),
    onSuccess: () => {
      // This tells React Query to refetch the list automatically!
      queryClient.invalidateQueries({ queryKey: ["packetContents"] });
    },
  });
};
export const useUpdatePacketContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn only takes ONE argument, so we destructure an object
    mutationFn: (data: any) =>
      PacketContentsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packetContents"] });
    },
  });
};

export const useCreatePacketContents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => PacketContentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packetContents"] });
    },
  });
};