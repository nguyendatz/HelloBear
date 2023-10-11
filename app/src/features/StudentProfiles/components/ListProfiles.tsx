import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { StudentProfile } from 'apis/nswag';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MAXIMUM_PROFILES } from '../utils';
import ProfileCard from './ProfileCard';

const ListProfiles = () => {
  const { t } = useTranslation();
  const [, setTriggerProps] = useState(new Date().getTime());
  const [isRemoveMode, setIsRemoveMode] = useState<boolean>(false);
  const handleRemove = () => {
    setIsRemoveMode((prev) => !prev);
  };
  const storeProfiles = localStorage.getItem('profiles');
  const profiles = (storeProfiles ? JSON.parse(storeProfiles) : []) as StudentProfile[];
  return (
    <Box
      sx={{
        paddingTop: 12,
        position: 'relative',
        minHeight: 900,
        height: '100%',
        backgroundImage: 'url(/images/bg-profiles.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        display: {
          xs: 'flex',
          lg: 'block'
        },
        alignItems: 'center',
        flexDirection: 'column',
        gap: 7
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Typography variant="h2">{t('profile.list')}</Typography>
        <Grid container spacing={2} my={2}>
          {profiles.map((profile) => (
            <React.Fragment key={profile.id}>
              <Grid item xs={6} sm={4}>
                <ProfileCard student={profile} isRemoveMode={isRemoveMode} onTrigger={setTriggerProps} />
              </Grid>
            </React.Fragment>
          ))}
          {profiles.length < MAXIMUM_PROFILES && (
            <Grid item xs={6} sm={4}>
              <ProfileCard isEmpty onTrigger={setTriggerProps} />
            </Grid>
          )}
        </Grid>
        <Box>
          <Button
            sx={{
              mx: 'auto',
              px: 6,
              py: 2,
              borderRadius: 40,
              boxShadow: '0px 2px 0px 0px #35704C',
              background: 'linear-gradient(101.08deg, #4C9D6B 8.92%, #35B064 93.37%)',
              color: '#FFF'
            }}
            onClick={handleRemove}
          >
            {t('profile.remove')}
          </Button>
        </Box>
      </Container>
      <Box
        component="img"
        src="/images/branding.png"
        alt="branding"
        draggable="false"
        sx={{
          width: {
            xs: 200,
            md: 250,
            lg: '20vw'
          },
          position: {
            xs: 'unset',
            lg: 'absolute'
          },
          bottom: 0,
          left: {
            lg: 40,
            xl: 70
          }
        }}
      ></Box>
    </Box>
  );
};

export default ListProfiles;
