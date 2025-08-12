import { useState, useEffect, useCallback } from 'react';

const UseFetch = (fn, initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (params = initialParams) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fn(params);
        setData(response);
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn, initialParams]
  );

  useEffect(() => {
    execute(initialParams);
  }, [execute, initialParams]);

  return { data, loading, error, fn: execute };
};

export default UseFetch;