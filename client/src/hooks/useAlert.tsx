import { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { quitLastAlert, setAlert } from '../features/projectSlice';

interface Data {
  alert: string;
  time: number;
  dispatchFn: boolean;
}

export const useAlert = () => {
  const [data, setData] = useState<Data>({ dispatchFn: false } as Data);
  const handleAlert = (alert: string, time: number = 3000) => {
    setData({ alert, time, dispatchFn: true });
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data.dispatchFn) {
      dispatch(setAlert(data.alert));
      setTimeout(() => {
        dispatch(quitLastAlert());
      }, data.time);
    }
  }, [data]);

  return [handleAlert];
};
