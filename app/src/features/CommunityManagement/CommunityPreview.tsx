import { Box, Typography } from '@mui/material';
import StudentPageLayout from 'app/layout/StudentPageLayout';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EInteractionTypes, PropsCommunityManagement } from './types';

const CommunityPreview: React.FC<PropsCommunityManagement> = ({
  checkImageInteraction,
  increaseInteraction,
  state,
  unitId,
  classId,
  id
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = state;

  const dataItem = useMemo(() => {
    return (data || [])?.find((item: any) => {
      return item.id == id;
    });
  }, [data, id]);

  const typeImage = useMemo(() => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];

    const extension: any = dataItem?.url?.split('.')?.pop()?.toLowerCase();

    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else {
      return 'unknown';
    }
  }, [dataItem]);

  return (
    <StudentPageLayout
      title={t('community.preview')}
      id="community"
      onBack={() => navigate(`/student/community/list?classId=${classId}&unitId=${unitId}`)}
    >
      <Box
        sx={{
          width: {
            xs: '100%',
            lg: '1000px'
          },
          margin: {
            lg: 'auto'
          }
        }}
      >
        <Box
          sx={{
            backgroundImage: 'url(/images/community/bg-frame.png)',
            width: '100%',
            height: 'auto',
            padding: '30px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          {typeImage === 'image' && (
            <Box
              sx={{
                borderImageSource: 'url(/images/community/frame.png)',
                borderImageSlice: '20 22',
                borderImageRepeat: 'round',
                borderImageWidth: '50px',
                position: 'relative',
                borderImageOutset: {
                  xs: 4,
                  lg: 7
                },
                height: {
                  xs: 225,
                  sm: 500
                },
                maxWidth: '100%',
                width: 'calc(100% - 16px)',
                zIndex: 1
              }}
            >
              <Box
                component={'img'}
                src={dataItem?.url}
                sx={{
                  width: 'calc(100% - 25px)',
                  height: {
                    xs: '90%',
                    sm: '96%'
                  },
                  objectFit: 'cover',
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              ></Box>
            </Box>
          )}

          {typeImage === 'video' && (
            <Box
              component="iframe"
              sx={{
                borderImageSource: 'url(/images/community/frame.png)',
                borderImageSlice: '20 22',
                borderImageRepeat: 'round',
                borderImageWidth: '50px',
                position: 'relative',
                borderImageOutset: {
                  xs: 4,
                  lg: 7
                },
                height: {
                  xs: 225,
                  sm: 500
                },
                maxWidth: '100%',
                width: 'calc(100% - 16px)',
                zIndex: 1
              }}
              src={dataItem?.url}
              allowFullScreen
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={'/images/community/line.png'}
              sx={{
                mr: 2
              }}
              id="image"
            ></Box>
            <Typography component={'h2'} sx={{ fontSize: { xs: 20, md: 25 } }}>
              {dataItem?.studentName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Box
              sx={{
                background: '#4A99D3',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'baseline',
                py: 1,
                px: 2,
                mr: 1
              }}
            >
              <Box
                component="img"
                src={checkImageInteraction(Number(id), EInteractionTypes.Heart)}
                mr={1}
                onClick={increaseInteraction(EInteractionTypes.Heart, Number(id))}
                sx={{ cursor: 'pointer' }}
              ></Box>
              <Typography variant="h2" sx={{ color: 'white', fontSize: 15, fontWeight: 400 }}>
                {dataItem?.heartNumber}
              </Typography>
            </Box>
            <Box
              sx={{
                background: '#9B449B',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'baseline',
                py: 1,
                px: 2
              }}
            >
              <Box
                component="img"
                mr={1}
                src={checkImageInteraction(Number(id), EInteractionTypes.Like)}
                onClick={increaseInteraction(EInteractionTypes.Like, Number(id))}
                sx={{ cursor: 'pointer' }}
              ></Box>
              <Typography variant="h2" sx={{ color: 'white', fontSize: 15, fontWeight: 400 }}>
                {dataItem?.likeNumber}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StudentPageLayout>
  );
};

export default CommunityPreview;
