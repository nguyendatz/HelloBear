import { studentClient } from 'apis';
import { ContentType } from 'apis/nswag';
import axios, { CancelToken } from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import StudentGameContainer from './components/StudentGameContainer';
import StudentPushListenContainer from './components/StudentPushListenContainer';
import { contentReducer, initialContentState } from './reducer';

const StudentContentContainer = () => {
  const { contentId } = useParams();
  const [state, dispatch] = useReducer(contentReducer, initialContentState);
  const { itemDetail } = state;
  const getDetailContent = useCallback(
    async (cancelToken?: CancelToken) => {
      if (!contentId) return;
      dispatch({ type: 'content.request' });
      try {
        const contentDetail = await studentClient.getContentDetail(+contentId, cancelToken);
        dispatch({ type: 'content.loaded', payload: contentDetail });
      } catch (err: any) {
        dispatch({ type: 'content.error', payload: err });
      }
    },
    [contentId]
  );
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    getDetailContent(cancelToken.token);
    return () => {
      cancelToken.cancel();
    };
  }, [getDetailContent]);
  if (!itemDetail) return <></>;
  switch (itemDetail.type) {
    case ContentType.PushAndListen:
      return <StudentPushListenContainer content={itemDetail} />;
    case ContentType.Game:
      return <StudentGameContainer content={itemDetail} />;
    default:
      return <></>;
  }
};

export default StudentContentContainer;
