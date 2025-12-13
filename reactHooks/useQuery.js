import { useEffect, useState } from "react";

export function useQuery(queryKey, queryFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    isMounted = true;
    setLoading(true);
    queryFn
      .then((val) => {
        if (mounted) {
          setData(val);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(queryKey)]);
  return { data, error, loading };
}
