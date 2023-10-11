import { Box, Grid, Typography } from '@mui/material';
import StudentPageLayout from 'app/layout/StudentPageLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { unitListReducer, initialUnitListState } from './reducer';
import { useReducer } from 'react';
import useInitialQueryFromSearchParams from 'common/hooks/useInitialQueryFromSearchParams';
import { classClient } from 'apis';
import { useDebounce } from 'react-use';
import { getRandomColor } from 'common/utils/stringUtils';

const StudentUnitListContainer = () => {
  const params = new URLSearchParams(window.location.search);
  const classId = Number(params.get('classId'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryFromSearchParams = useInitialQueryFromSearchParams({ classId: 0 });
  const [state, dispatch] = useReducer(unitListReducer, {
    ...initialUnitListState,
    query: queryFromSearchParams
  });
  const { data } = state;

  const getData = (classId: number) => {
    dispatch({ type: 'unitList.request' });
    const loadData = async () => {
      try {
        const promiseData = await classClient.getLessonsByClass(classId);

        dispatch({ type: 'unitList.loaded', payload: promiseData });
      } catch (err: any) {
        dispatch({ type: 'unitList.error', payload: err });
      }
    };
    loadData();
  };

  useDebounce(
    () => {
      getData(classId);
    },
    300,
    [classId]
  );

  return (
    <StudentPageLayout
      title={t('unit.unitList')}
      id="unit-list"
      onBack={() => navigate(`/student/unit-list?classId=${classId}`)}
    >
      <Box component={'img'} sx={{ width: '100%', height: '100%', my: 3 }} src="/images/unit/hello-you.png"></Box>
      <Grid container justifyContent={'center'} rowSpacing={2} columnSpacing={2}>
        {data?.map((item) => {
          return (
            <Grid item xs={6} sm={3} key={item.id}>
              <Box
                sx={{
                  height: {
                    xs: 160,
                    md: 220,
                    xl: 300
                  },
                  width: {
                    xs: 160,
                    md: 220,
                    xl: 300
                  },
                  backgroundImage: 'url(/images/unit/circle.png)',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom',
                  backgroundColor: getRandomColor(),
                  borderRadius: '50%',
                  margin: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h1">{item.number}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </StudentPageLayout>
  );
};

export default StudentUnitListContainer;
