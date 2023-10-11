import { appConfigs } from 'common/consts/configs';
import axiosInstance from './https';
import * as nswag from './nswag';

const userClient = new nswag.UserClient(appConfigs.apiUrl, axiosInstance);
const authClient = new nswag.AuthClient(appConfigs.apiUrl, axiosInstance);
const classClient = new nswag.ClassClient(appConfigs.apiUrl, axiosInstance);
const textBookClient = new nswag.TextBookClient(appConfigs.apiUrl, axiosInstance);
const unitClient = new nswag.LessonClient(appConfigs.apiUrl, axiosInstance);
const contentClient = new nswag.ContentClient(appConfigs.apiUrl, axiosInstance);
const pushListenClient = new nswag.PushAndListenClient(appConfigs.apiUrl, axiosInstance);
const studentClient = new nswag.StudentClient(appConfigs.apiUrl, axiosInstance);
const communityClient = new nswag.CommunityClient(appConfigs.apiUrl, axiosInstance);
export {
  authClient,
  classClient,
  contentClient,
  textBookClient,
  unitClient,
  userClient,
  pushListenClient,
  studentClient,
  communityClient
};
