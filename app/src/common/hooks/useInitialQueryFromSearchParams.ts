import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Hook for getting initial search params to support query
function useInitialQueryFromSearchParams<T extends object>(queryProps: T) {
  const [searchParams] = useSearchParams();

  const query = { ...queryProps };

  const initialQueryFromSearchParams = useMemo(() => {
    Object.keys(query).forEach((key) => {
      const searchParam = searchParams.get(key);
      if (searchParam) {
        query[key as keyof T] = JSON.parse(searchParam);
      }
    });
    return query;
    // Init only 1 time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initialQueryFromSearchParams;
}

export default useInitialQueryFromSearchParams;
