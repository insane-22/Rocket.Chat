import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { useSetModal, useToastMessageDispatch, useMethod } from '@rocket.chat/ui-contexts';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import GenericModal from '../../components/GenericModal';

export const useRemoveBusinessHour = () => {
	const { t } = useTranslation();
	const setModal = useSetModal();
	const dispatchToastMessage = useToastMessageDispatch();
	const removeBusinessHour = useMethod('livechat:removeBusinessHour');
	const queryClient = useQueryClient();

	const handleRemove = useMutableCallback((_id, type) => {
		const onDeleteBusinessHour = async () => {
			try {
				await removeBusinessHour(_id, type);
				dispatchToastMessage({ type: 'success', message: t('Business_Hour_Removed') });
				queryClient.invalidateQueries(['livechat-getBusinessHours']);
			} catch (error) {
				dispatchToastMessage({ type: 'error', message: error });
			} finally {
				setModal();
			}
		};

		setModal(<GenericModal variant='danger' onConfirm={onDeleteBusinessHour} onCancel={() => setModal()} confirmText={t('Delete')} />);
	});

	return handleRemove;
};
