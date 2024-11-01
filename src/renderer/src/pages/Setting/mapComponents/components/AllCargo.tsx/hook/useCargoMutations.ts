// hooks/useCargoMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageInstance } from 'antd/es/message/interface';
import type { CargoMissionEdit, EditColumn } from '../types';
import httpClient from '~/api/httpClient';
import { Err } from '~/types/Tools';

export const useCargoMutations = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: (editValue: CargoMissionEdit) =>
      httpClient.post('api/setting/edit-loc', editValue),
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['all-pallet'] }),
        queryClient.refetchQueries({ queryKey: ['cargoLoc-mission'] }),
        queryClient.refetchQueries({ queryKey: ['locations'] }),
        queryClient.refetchQueries({ queryKey: ['shelf'] }),
      ]);
    },
    onError: (error: Err) => {
      void messageApi.error(error.response?.data?.msg || 'Edit failed');
    },
  });

  const editColumnMutation = useMutation({
    mutationFn: ({ locationId, level }: EditColumn) =>
      httpClient.post('api/setting/edit-column', { locationId, level }),
    onSuccess: async () => {
      void messageApi.success('Edit success');
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['cargoLoc-mission'] }),
        queryClient.refetchQueries({ queryKey: ['locations'] }),
        queryClient.refetchQueries({ queryKey: ['shelf'] }),
      ]);
    },
    onError: (error: Err) => {
      void messageApi.error(error.response?.data?.msg || 'Edit column failed');
    },
  });

  return {
    editMutation,
    editColumnMutation,
  };
};
