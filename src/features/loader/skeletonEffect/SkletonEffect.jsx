import React from 'react';
import Skeleton from './Skeleton';

const SkeletonEffect = ({count,className=""}) => {
    const skeletons = Array.from({length: count}, (_, index) => (
        <Skeleton className={className} key={index}/>
    ));
    return <div className='skeleton_wrapper'>{skeletons}</div>;
}
export default SkeletonEffect