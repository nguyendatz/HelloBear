import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box, useTheme } from '@mui/material';
import { pushListenClient } from 'apis';
import { PushAndListenResponse, UpsertPushAndListenCommand } from 'apis/nswag';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import { Howl } from 'howler';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { PositionType, RenderRectangles } from '../types';
import { buildRenderRectangles } from '../utils';
import RectangleDialog from './RectangleDialog';

interface IProps {
  image: string;
  rectangles: PushAndListenResponse[];
  onTrigger: Dispatch<SetStateAction<number>>;
}

const DrawContainer = ({ image, rectangles, onTrigger }: IProps) => {
  const { contentId } = useParams();
  const theme = useTheme();
  const dialog = useDialog();
  // TO-DO
  const [renderRectangles, setRenderRectangles] = useState<RenderRectangles[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMouseLeave, setIsMouseLeave] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [triggerResizeProps, setTriggerResizeProps] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const canvasOffSetX = useRef<number | null>(null);
  const canvasOffSetY = useRef<number | null>(null);

  const positionRef = useRef<PositionType>({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;

    const context = canvas.getContext('2d');

    contextRef.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();
    canvasOffSetX.current = canvasOffSet.left;
    canvasOffSetY.current = canvasOffSet.top;
  }, []);

  const onResizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && imageRef.current) {
      canvas.width = imageRef.current.offsetWidth;
      canvas.height = imageRef.current.offsetHeight;

      const canvasOffSet = canvas.getBoundingClientRect();
      canvasOffSetX.current = canvasOffSet.left;
      canvasOffSetY.current = canvasOffSet.top;
    }
  };
  const onRenderRectanglesToScreen = useCallback(() => {
    setRenderRectangles(
      buildRenderRectangles(rectangles, imageRef.current?.offsetWidth ?? 0, imageRef.current?.offsetHeight ?? 0)
    );
  }, [rectangles]);

  const onPlaySound = (rect: RenderRectangles) => {
    const sound = new Howl({
      src: [rect.audioFileUrl as string]
    });
    sound.play();
  };

  const startDrawingRectangle = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isMouseLeave && isDrawing) {
      return setIsMouseLeave(false);
    }
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    positionRef.current.left = nativeEvent.offsetX;
    positionRef.current.top = nativeEvent.offsetY;

    setIsDrawing(true);
  };

  const drawRectangle = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing || !canvasRef.current || !contextRef.current) {
      return;
    }
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    const newMouseX = nativeEvent.offsetX;
    const newMouseY = nativeEvent.offsetY;
    const recWidth = newMouseX - Number(positionRef.current.left);
    const rectHeight = newMouseY - Number(positionRef.current.top);

    contextRef.current.strokeStyle = '#ADFF2F';
    contextRef.current.lineWidth = 3;

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.strokeRect(
      Number(positionRef.current.left),
      Number(positionRef.current.top),
      recWidth,
      rectHeight
    );

    positionRef.current.width = recWidth;
    positionRef.current.height = rectHeight;
  };

  const stopDrawingRectangle = async () => {
    if (isDrawing) {
      const width = positionRef.current.width;
      const height = positionRef.current.height;

      setIsDrawing(false);
      if (width && height) {
        const detailRectangle = (await dialog.show(RectangleDialog, {})) as Pick<
          UpsertPushAndListenCommand,
          'name' | 'audioFileUrl'
        >;
        if (detailRectangle) {
          const startX = width < 0 ? Math.ceil(positionRef.current.left + width) : Math.ceil(positionRef.current.left);
          const startY = height < 0 ? Math.ceil(positionRef.current.top + height) : Math.ceil(positionRef.current.top);
          const newRectangle: UpsertPushAndListenCommand = {
            id: 0,
            contentId: +(contentId || 0),
            name: detailRectangle.name,
            audioFileUrl: detailRectangle.audioFileUrl,
            startX,
            startY,
            endX: Math.ceil(startX + Math.abs(width)),
            endY: Math.ceil(startY + Math.abs(height)),
            originalWidth: Math.ceil(imageRef.current?.offsetWidth ?? 0),
            originalHeight: Math.ceil(imageRef.current?.offsetHeight ?? 0)
          };
          //Call API
          try {
            await pushListenClient.save({ ...newRectangle });
            showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
            onTrigger(new Date().getTime());
          } catch {}
        }
        contextRef.current?.clearRect(0, 0, imageRef.current?.offsetWidth ?? 0, imageRef.current?.offsetHeight ?? 0);
        positionRef.current.width = 0;
        positionRef.current.height = 0;
      }
    }
  };
  useEffect(() => {
    window.addEventListener('resize', () => {
      setTriggerResizeProps(new Date().getTime());
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, [onRenderRectanglesToScreen]);
  useEffect(() => {
    const elBtnDrawer = document.getElementById('btn-drawer');
    elBtnDrawer?.addEventListener('click', () => {
      setTriggerResizeProps(new Date().getTime());
    });
    return () => {
      elBtnDrawer?.removeEventListener('click', () => {});
    };
  }, []);
  useEffect(() => {
    if (isLoaded) {
      onRenderRectanglesToScreen();
    }
  }, [onRenderRectanglesToScreen, isLoaded]);
  useDebounce(
    () => {
      if (triggerResizeProps) {
        onResizeCanvas();
        onRenderRectanglesToScreen();
      }
    },
    theme.transitions.duration.enteringScreen,
    [triggerResizeProps]
  );
  return (
    <Box
      style={{
        width: '100%',
        position: 'relative'
      }}
    >
      <img
        id="draw-image"
        src={image}
        alt="textbook-image"
        style={{ width: '100%', height: '100%' }}
        draggable="false"
        onLoad={() => {
          onResizeCanvas();
          setIsLoaded(true);
        }}
        ref={imageRef}
      />
      <canvas
        id="canvas-container"
        className="canvas-container-rect"
        ref={canvasRef}
        onMouseDown={startDrawingRectangle}
        onMouseMove={drawRectangle}
        onMouseUp={stopDrawingRectangle}
        onMouseLeave={() => {
          setIsMouseLeave(true);
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      ></canvas>
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
  );
};

export default DrawContainer;
