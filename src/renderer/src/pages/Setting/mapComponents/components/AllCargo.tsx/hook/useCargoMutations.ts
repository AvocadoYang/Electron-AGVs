// hooks/useCargoMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageInstance } from 'antd/es/message/interface';
import type { CargoMissionEdit, EditColumn } from '../types';
import client from '@renderer/api/axiosClient';
import { Err } from '@renderer/utils/responseErr';

export const useCargoMutations = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: (editValue: CargoMissionEdit) => client.post('api/setting/edit-loc', editValue),
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['cargoLoc-mission'] }),
        queryClient.refetchQueries({ queryKey: ['locations'] }),
        queryClient.refetchQueries({ queryKey: ['shelf'] })
      ]);
    },
    onError: (error: Err) => {
      void messageApi.error(error.response?.data.message || 'Edit failed');
    }
  });

  const editColumnMutation = useMutation({
    mutationFn: ({ locationId, level }: EditColumn) =>
      client.post('api/setting/edit-column', { locationId, level }),
    onSuccess: async () => {
      void messageApi.success('Edit success');
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['cargoLoc-mission'] }),
        queryClient.refetchQueries({ queryKey: ['locations'] }),
        queryClient.refetchQueries({ queryKey: ['shelf'] })
      ]);
    },
    onError: (error: Err) => {
      void messageApi.error(error.response?.data?.message || 'Edit column failed');
    }
  });

  return {
    editMutation,
    editColumnMutation
  };
};
