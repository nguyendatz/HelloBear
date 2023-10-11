import { useEffect, useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';

// Hook for updating search params automatically by query object
function useSearchParamsWithQuery<T extends object>(query: T) {
  const [, setSearchParams] = useSearchParams();

  const stringifyQuery = useMemo(() => JSON.stringify(query), [query]);

  useEffect(() => {
    const searchParams: URLSearchParamsInit = {};

    const parsedQuery = JSON.parse(stringifyQuery);

    Object.keys(parsedQuery).forEach((key) => {
      const value = parsedQuery[key as keyof typeof parsedQuery];

      let existParam = false;

      if (typeof value === 'string' && value !== '') {
        existParam = true;
      }

      if (typeof value === 'number' && !isNaN(value)) {
        existParam = true;
      }

      if (Array.isArray(value)) {
        existParam = true;
      }

      if (existParam) {
        searchParams[key] = JSON.stringify(parsedQuery[key as keyof typeof parsedQuery]);
      }
    });

    return setSearchParams(searchParams, { replace: true });
  }, [stringifyQuery, setSearchParams]);
}

export default useSearchParamsWithQuery;
