import { Box, MenuItem } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { pushListenClient } from 'apis';
import { PushAndListenResponse } from 'apis/nswag';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import Table from 'components/Table';
import ThreeDotsMenu from 'components/ThreeDotsMenu';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RectangleDialog from './RectangleDialog';

interface IProps {
  rectangles: PushAndListenResponse[];
  onTrigger: Dispatch<SetStateAction<number>>;
}

const ListPushListen = ({ rectangles, onTrigger }: IProps) => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const columnHelper = createColumnHelper<PushAndListenResponse>();
  const handleDeleteRectangle = useCallback(
    async (rectId: number, rectName: string) => {
      const res: any = await dialog.message({
        title: '',
        message: `${t('pushListen.alertDelete')} ${rectName}`
      });
      if (res.success) {
        await pushListenClient.delete(rectId);
        showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
        onTrigger(new Date().getTime());
      }
    },
    [onTrigger, dialog, t]
  );
  const handleEditRectangle = useCallback(
    async (rectId: number) => {
      const rectangleIndex = rectangles.findIndex((r) => r.id === rectId);
      if (rectangleIndex !== -1) {
        const currentRectangle = rectangles[rectangleIndex];
        const newRectangleDetail = await dialog.show(RectangleDialog, { rectangle: currentRectangle });
        if (newRectangleDetail) {
          await pushListenClient.save({ ...currentRectangle, ...newRectangleDetail });
          showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
          onTrigger(new Date().getTime());
        }
      }
    },
    [dialog, onTrigger, rectangles]
  );
  const rectangleColumns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        enableSorting: false
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: (props) => {
          const { original } = props.row;
          return (
            <ThreeDotsMenu>
              <MenuItem onClick={() => handleEditRectangle(original.id || 0)}>Edit</MenuItem>
              <MenuItem onClick={() => handleDeleteRectangle(original.id || 0, original.name ?? '')}>Delete</MenuItem>
            </ThreeDotsMenu>
          );
        },
        enableSorting: false
      })
    ],
    [columnHelper, handleEditRectangle, handleDeleteRectangle]
  );
  return (
    <Box>
      <Table result={rectangles} columns={rectangleColumns} />
    </Box>
  );
};

export default ListPushListen;
