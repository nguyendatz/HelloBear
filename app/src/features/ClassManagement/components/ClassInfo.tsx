import { Box, Grid, TextField } from '@mui/material';
import { ClassDetailResponse } from 'apis/nswag';
import { useTranslation } from 'react-i18next';

interface IProps {
  classInfo: ClassDetailResponse;
}

const ClassInfo = ({ classInfo }: IProps) => {
  const { t } = useTranslation();
  return (
    <Box mt={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField label="Size" id="outlined-size-small" defaultValue="Small" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={4}>
          {t('classManagement.classStatus')}
        </Grid>
        <Grid item xs={12} md={4}>
          Class name text field
        </Grid>
        <Grid item xs={12} md={4}>
          Textbook dropdown
        </Grid>
        <Grid item xs={12} md={4}>
          Main Teacher field
        </Grid>
        <Grid item xs={12} md={4}>
          Secondary Teachers dropdown
        </Grid>
        <Grid item xs={12} md={6}>
          Start Date
        </Grid>
        <Grid item xs={12} md={6}>
          End Date
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClassInfo;
