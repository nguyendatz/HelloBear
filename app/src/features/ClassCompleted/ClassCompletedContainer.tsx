import { Box, Button, Grid, Typography } from '@mui/material';
import StudentPageLayout from 'app/layout/StudentPageLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ClassCompletedContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <StudentPageLayout title="Class Completed" id="Class_Completed" onBack={() => navigate('/student')}>
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          This class is completed!
          <br />
          Please click on the following links to continue to learn.
        </Grid>
      </Grid>
      <Grid container mt={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              color: '#9B449B',
              fontSize: 30,
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            クラス完了
          </Typography>
        </Grid>
        <Grid item xs={12} mt={2} sx={{ textAlign: 'center' }}>
          このクラスは終了しました！学習を続けるために、以下のリンクをクリックしてください。
        </Grid>
      </Grid>
      <Box component="div" mt={4}>
        <Button
          size="large"
          variant="contained"
          sx={{ mr: 1, backgroundColor: '#FFBF1E', color: '#fff', borderRadius: '40px', padding: '12px 40px' }}
          onClick={() => navigate('/student/units')}
        >
          {t('navigation.UnitList')}
        </Button>
        <Button
          size="large"
          variant="contained"
          sx={{ ml: 1, backgroundColor: '#4C9D6B', color: '#fff', borderRadius: '40px', padding: '12px 40px' }}
          onClick={() => navigate('/student/game')}
        >
          {t('navigation.Game')}
        </Button>
      </Box>
    </StudentPageLayout>
  );
};

export default ClassCompletedContainer;
