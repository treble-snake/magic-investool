import {fetcher} from '../../libs/api';
import {ApiError} from '../error/ApiError';
import React from 'react';
import useSWR, {KeyedMutator} from 'swr';
import {Spin} from 'antd';


type Props<TData> = {
  apiUrl: string;
  children: (props: { data: TData, mutate: KeyedMutator<TData> }) => JSX.Element;
}

export function DisplayData<TData>({apiUrl, children}: Props<TData>) {
  const {
    data,
    error,
    mutate
  } = useSWR<TData>(apiUrl, fetcher);

  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  return (
    <>
      {children({data, mutate})}
    </>
  );
}