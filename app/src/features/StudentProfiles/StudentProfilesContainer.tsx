import EmptyProfile from './components/EmptyProfile';
import ListProfiles from './components/ListProfiles';

const StudentProfilesContainer = () => {
  const profiles = localStorage.getItem('profiles');
  const isHasProfiles = Boolean(profiles);
  return isHasProfiles ? <ListProfiles /> : <EmptyProfile />;
};

export default StudentProfilesContainer;
