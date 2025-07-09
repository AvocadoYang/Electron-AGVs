import { useMutation } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export function useReverifyCargoFormat(refetch?: () => void) {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: (id: string) => client.post('/api/cargo-history/re-verity-cargo-format', { id }),
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      refetch?.();
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  return { ...mutation, contextHolder };
}
