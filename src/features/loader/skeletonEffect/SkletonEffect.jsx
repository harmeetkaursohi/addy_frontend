import React from 'react';
import Skeleton from './Skeleton';
const SkeletonEffect = ({ count }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Skeleton key={index} />
  ));
  return <div className='skeleton_wrapper'>{skeletons}</div>;
  }
  export default SkeletonEffect