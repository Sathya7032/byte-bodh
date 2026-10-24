import { useCallback, useEffect, useState } from "react";
import { fetchPublicPlans } from "../api/publicPlansApi";

/** Loads the admin-configured, active subscription plans. */
export default function usePublicPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback((force = false) => {
    setLoading(true);
    setError(null);
    fetchPublicPlans(force)
      .then(setPlans)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { plans, loading, error, reload: () => load(true) };
}
