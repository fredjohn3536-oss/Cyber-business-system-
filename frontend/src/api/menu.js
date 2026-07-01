import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

const initialState = {
  isDashboardDrawerOpened: true
};

const endpoints = {
  key: 'api/menu',
  master: 'master',
};

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}

export function useMenu() {
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? true;
  const drawerToggle = () => handlerDrawerOpen(!drawerOpen);

  return { drawerOpen, drawerToggle, menuMasterLoading };
}
