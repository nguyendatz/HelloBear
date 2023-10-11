import { Box, Button, Grid } from '@mui/material';
import { StudentContentDetailResponse } from 'apis/nswag';
import StudentPageLayout from 'app/layout/StudentPageLayout';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface IProps {
  content: StudentContentDetailResponse;
}

const StudentGameContainer = ({ content }: IProps) => {
  const navigate = useNavigate();
  return (
    <StudentPageLayout title={t('game.game')} id="Content_Game" onBack={() => navigate('/student/content')}>
      {content.wordwallNetLink && (
        <Box
          component="iframe"
          sx={{
            width: {
              xs: '100%',
              md: 700
            },
            height: {
              xs: 235,
              sm: 350
            },
            maxWidth: '100%',
            border: 0
          }}
          src={content.wordwallNetLink}
          allowFullScreen
        />
      )}
      <Grid container>
        <Grid item xs={6} sx={{ textAlign: 'left' }}>
          {content?.name}
          <span style={{ display: 'block', color: '#6C6C6C' }}>by Tswaladuncan</span>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Button
            sx={{ color: '#1C1939', textTransform: 'none' }}
            startIcon={<Box component="img" src={'/icons/share.png'} />}
          >
            {t('game.share')}
          </Button>
        </Grid>
      </Grid>
    </StudentPageLayout>
  );
};

export default StudentGameContainer;
