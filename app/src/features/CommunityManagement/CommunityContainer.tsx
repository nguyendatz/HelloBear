import { classClient, communityClient } from 'apis';
import { useReducer } from 'react';
import { useDebounce, useLocalStorage } from 'react-use';
import { communityReducer, initialCommunityState } from './reducer';
import { LoginResponse, ReactionType } from 'apis/nswag';
import { EInteractionTypes, EModeComponentTypes } from './types';
import CommunityPreview from './CommunityPreview';
import CommunityList from './CommunityList';
import useInitialQueryFromSearchParams from 'common/hooks/useInitialQueryFromSearchParams';
import { useParams } from 'react-router-dom';
import { getRandomColor } from 'common/utils/stringUtils';

const CommunityContainer = () => {
  const [communityHasInteracted, setCommunityHasInteracted] = useLocalStorage<{ [key: string]: any[] }>(
    'communityHasInteracted'
  );
  const [loginInfo] = useLocalStorage<LoginResponse>('loginInfo');

  const params = new URLSearchParams(window.location.search);
  const unitId = Number(params.get('unitId'));
  const classId = Number(params.get('classId'));
  const communityId = Number(params.get('id'));
  const queryFromSearchParams = useInitialQueryFromSearchParams({ classId, unitId, id: communityId });
  const [state, dispatch] = useReducer(communityReducer, {
    ...initialCommunityState,
    query: queryFromSearchParams
  });
  const { query } = state;
  const { mode } = useParams();

  const getData = (lessonId: number, classId: number) => {
    dispatch({ type: 'community.request' });
    const loadData = async () => {
      try {
        const promiseData = communityClient.getCommunities(lessonId, classId);
        const promiseDataFilters = classClient.getLessonsByClass(Number(classId));

        const [responseCommunityData, responseFilters] = await Promise.all([promiseData, promiseDataFilters]);

        dispatch({ type: 'community.loaded', payload: responseCommunityData });
        dispatch({ type: 'community.loadedFilters', payload: responseFilters });
      } catch (err: any) {
        dispatch({ type: 'community.error', payload: err });
      }
    };
    loadData();
  };

  useDebounce(
    () => {
      getData(Number(unitId), Number(classId));
    },
    300,
    [query, mode]
  );

  const increaseInteraction = (InteractionTypes: EInteractionTypes, id: number) => async () => {
    const getDataIncrease = async () => {
      const res = await communityClient.reactCommunity(
        id,
        InteractionTypes === EInteractionTypes.Like ? ReactionType.Like : ReactionType.Heart
      );

      if (res) {
        await getData(Number(unitId), Number(classId));
      }
    };

    if (!communityHasInteracted) {
      setCommunityHasInteracted({ [id]: [{ email: loginInfo?.email, [InteractionTypes]: true }] });
      getDataIncrease();
      return;
    }

    const dataContent = communityHasInteracted?.[id];

    if (!dataContent) {
      setCommunityHasInteracted({
        ...communityHasInteracted,
        [id]: [{ email: loginInfo?.email, [InteractionTypes]: true }]
      });
      getDataIncrease();
      return;
    }

    const item = dataContent.find((element: any) => {
      return element.email === loginInfo?.email;
    });

    if (item && item?.[InteractionTypes]) return;

    item[InteractionTypes] = true;
    setCommunityHasInteracted({ ...communityHasInteracted, [id]: dataContent });

    getDataIncrease();
  };

  const checkImageInteraction = (id: number, InteractionTypes: EInteractionTypes) => {
    const data = communityHasInteracted;
    const type = InteractionTypes === EInteractionTypes.Heart ? true : false;
    let res = type ? '/images/community/star.png' : '/images/community/like.png';

    if (data) {
      const checked = (communityHasInteracted[id] || []).some((item: any) => {
        return item.email === loginInfo?.email && item[InteractionTypes];
      });

      if (checked) {
        res = type ? '/images/community/star-liked.png' : '/images/community/liked.png';
      }
    }

    return res;
  };

  return (
    <>
      {mode === EModeComponentTypes.Preview && (
        <CommunityPreview
          increaseInteraction={increaseInteraction}
          checkImageInteraction={checkImageInteraction}
          state={state}
          id={communityId}
          classId={classId}
          unitId={unitId}
        />
      )}
      {mode === EModeComponentTypes.List && (
        <CommunityList
          getRandomColor={getRandomColor}
          increaseInteraction={increaseInteraction}
          checkImageInteraction={checkImageInteraction}
          state={state}
          classId={classId}
          unitId={unitId}
        />
      )}
    </>
  );
};

export default CommunityContainer;
