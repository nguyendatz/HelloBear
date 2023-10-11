import { ContentDetailResponse } from 'apis/nswag';
import { ICommonReadItemDetailPage } from 'types/Common';

export interface IContentItemDetailPage<TItem> extends ICommonReadItemDetailPage<TItem> {
  isSaving?: boolean;
}

export enum EContentText {
  None = 'None',
  Read = 'Read',
  Music = 'Music',
  Video = 'Video',
  Game = 'Game',
  PushAndListen = 'Push & Listen',
  Record = 'Record',
}
export interface ContentDetailValues extends ContentDetailResponse {
  pageImageFile?: File;
}
