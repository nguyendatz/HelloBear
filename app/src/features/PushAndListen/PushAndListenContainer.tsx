import { Grid } from '@mui/material';
import { pushListenClient } from 'apis';
import { PushAndListenResponse } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import axios, { CancelToken } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DrawContainer from './components/DrawConainer';
import ListPushListen from './components/ListPushListen';

interface IProps {
  image: string;
}

const PushAndListenContainer = ({ image }: IProps) => {
  const { contentId } = useParams();
  const [rectangles, setRectangles] = useState<PushAndListenResponse[]>([]);
  const [triggerProps, setTriggerProps] = useState(new Date().getTime());

  const getRectangles = useCallback(
    async (cancelToken?: CancelToken) => {
      if (!contentId) {
        return;
      }
      const responseRectangles = await pushListenClient.get(+contentId, cancelToken);
      if (responseRectangles) {
        setRectangles(responseRectangles);
      }
    },
    [contentId]
  );

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    if (image) {
      getRectangles(cancelToken.token);
    }
    return () => {
      Howler.stop();
      cancelToken.cancel();
    };
  }, [image, triggerProps, getRectangles]);
  return (
    <AdminPageLayout id="pushlisten" title="Push & Listen Setup">
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} lg={5}>
          {image && <ListPushListen rectangles={rectangles} onTrigger={setTriggerProps} />}
        </Grid>
        <Grid item xs={12} lg={7}>
          {image && <DrawContainer rectangles={rectangles} image={image} onTrigger={setTriggerProps} />}
        </Grid>
      </Grid>
    </AdminPageLayout>
  );
};

export default PushAndListenContainer;
