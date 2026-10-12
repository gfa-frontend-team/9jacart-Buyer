import React from 'react';
import { ErrorState } from '@/components/UI/ErrorState';

const NotFoundPage: React.FC = () => {
  return <ErrorState kind="notfound" />;
};

export default NotFoundPage;
