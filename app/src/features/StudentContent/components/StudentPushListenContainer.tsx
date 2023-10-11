import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box } from '@mui/material';
import { studentClient } from 'apis';
import { StudentContentDetailResponse, StudentPushAndListenResponse } from 'apis/nswag';
import StudentPageLayout from 'app/layout/StudentPageLayout';
import axios, { CancelToken } from 'axios';
import { Howl } from 'howler';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { RenderRectangles } from '../types';
import { buildRenderRectangles } from '../utils';
interface IProps {
  content: StudentContentDetailResponse;
}

const StudentPushListenContainer = ({ content }: IProps) => {
  const navigate = useNavigate();
  const [pushListenContent, setPushListenContent] = useState<StudentPushAndListenResponse[]>([]);
  const [renderRectangles, setRenderRectangles] = useState<RenderRectangles[]>([]);
  const [triggerResizeProps, setTriggerResizeProps] = useState<number>(new Date().getTime());
  const imageRef = useRef<HTMLImageElement>();
  const getPushAndListens = useCallback(
    async (cancelToken?: CancelToken) => {
      const pushAndListens = await studentClient.getPushAndListen(content.id ?? 0, cancelToken);
      setPushListenContent(pushAndListens);
    },
    [content.id]
  );
  const getRenderRectangles = useCallback(() => {
    if (pushListenContent.length > 0 && imageRef.current) {
      const renderRectangles = buildRenderRectangles(
        pushListenContent,
        imageRef.current.offsetWidth,
        imageRef.current.offsetHeight
      );
      setRenderRectangles(renderRectangles);
    }
  }, [pushListenContent]);
  const onPlaySound = (rect: RenderRectangles) => {
    const sound = new Howl({
      src: [rect.audioFileUrl as string]
    });
    sound.play();
  };
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    getPushAndListens(cancelToken.token);
    return () => {
      cancelToken.cancel();
    };
  }, [getPushAndListens]);
  useEffect(() => {
    getRenderRectangles();
  }, [getRenderRectangles]);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setTriggerResizeProps(new Date().getTime());
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);
  useDebounce(() => getRenderRectangles(), 200, [triggerResizeProps]);
  return (
    <StudentPageLayout title="Push & Listen" id="Push_Listen" onBack={() => navigate('/student/class-completed')}>
      <Box
        sx={{
          position: 'relative',
          width: 'fit-content',
          height: 'fit-content',
          marginX: 'auto'
        }}
      >
        <Box
          component="img"
          alt="push_listen_image"
          src={content.pageImage}
          sx={{
            maxWidth: 1,
            maxHeight: 1
          }}
          ref={imageRef}
        ></Box>
        {renderRectangles.map((rect) => (
          <Box
            key={rect.id}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              cursor: 'pointer',
              border: '3px dashed #ADFF2F',
              borderRadius: '4px',
              top: rect.renderTop,
              left: rect.renderLeft,
              width: rect.renderWidth,
              height: rect.renderHeight,
              background: 'rgba(0,0,0,0.5)'
            }}
            onClick={() => onPlaySound(rect)}
          >
            <PlayCircleIcon fontSize="large" htmlColor="#FFF" />
          </Box>
        ))}
      </Box>
    </StudentPageLayout>
  );
};

export default StudentPushListenContainer;
