import { Box, Grid, Typography } from '@mui/material';
import StudentPageLayout from 'app/layout/StudentPageLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LessonsByClassResponse } from 'apis/nswag';
import { EInteractionTypes, PropsCommunityManagement } from './types';

const CommunityList: React.FC<PropsCommunityManagement> = ({
  checkImageInteraction,
  increaseInteraction,
  getRandomColor = () => '',
  state,
  classId
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, filters } = state;

  return (
    <StudentPageLayout
      title={t('community.title')}
      id="community"
      onBack={() => navigate('/student/community')}
      filters={{
        options: (filters || [])?.map((item) => {
          return {
            id: Number(item.id),
            title: item.name?.toString()
          };
        }) as any[],
        onClick: async (data: LessonsByClassResponse) => {
          navigate(`/student/community/list?classId=${classId}&unitId=${data.id}`);
        }
      }}
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
        <Grid container justifyContent={'space-between'} columnSpacing={2} rowSpacing={4}>
          {(data || [])?.map((item, index) => {
            return (
              <Grid item xs={6} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    background: getRandomColor(),
                    borderRadius: '20px',
                    p: {
                      xs: 1,
                      sm: 3
                    },
                    m: 'auto'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      onClick={() =>
                        navigate(
                          `/student/community/preview?classId=${item.classId}&unitId=${item.lessonId}&id=${item.id}`
                        )
                      }
                      component="img"
                      src={item.thumbnail}
                      sx={{
                        width: '100%',
                        objectFit: 'cover',
                        height: {
                          xs: '150px',
                          sm: '250px'
                        },
                        cursor: 'pointer'
                      }}
                    ></Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                    <Box
                      component="img"
                      src={checkImageInteraction(Number(item.id), EInteractionTypes.Heart)}
                      mr={1}
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={increaseInteraction(EInteractionTypes.Heart, Number(item.id))}
                    ></Box>
                    <Typography variant="h2" sx={{ color: 'white', fontSize: 15, fontWeight: 400, mr: 3 }}>
                      {item.heartNumber}
                    </Typography>
                    <Box
                      component="img"
                      src={checkImageInteraction(Number(item.id), EInteractionTypes.Like)}
                      mr={1}
                      onClick={increaseInteraction(EInteractionTypes.Like, Number(item.id))}
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                    ></Box>
                    <Typography variant="h2" sx={{ color: 'white', fontSize: 15, fontWeight: 400 }}>
                      {item.likeNumber}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </StudentPageLayout>
  );
};

export default CommunityList;
