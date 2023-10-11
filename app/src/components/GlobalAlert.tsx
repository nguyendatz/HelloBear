import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

import { IToastMessage, subscribeNotification, unSubscribeNotification } from 'common/utils/toastNotification';

const componentName = 'GlobalAlert';

export const GlobalAlert = () => {
  const [messageList, setMessageList] = React.useState<IToastMessage[]>([]);
  React.useEffect(() => {
    subscribeNotification(componentName, (message: IToastMessage) => {
      setMessageList([...messageList, message]);
    });
    return function cleanup() {
      unSubscribeNotification(componentName);
    };
  });

  const handleClose = (messageItem: IToastMessage) => (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessageList((prev) => {
      return prev.filter((item: IToastMessage) => item.id !== messageItem.id);
    });
  };

  return (
    <>
      {messageList.map((x: IToastMessage) => (
        <Snackbar
          key={x.id}
          open
          autoHideDuration={x.autoHideDuration ?? 3000}
          onClose={handleClose(x)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleClose(x)}
            severity={(x.severity ?? 'info') as AlertColor}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {x.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default GlobalAlert;
