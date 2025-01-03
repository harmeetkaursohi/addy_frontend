import React from 'react';
import Skeleton from './Skeleton';

const SkeletonEffect = ({count,className=""}) => {
    const skeletons = Array.from({length: count}, (_, index) => (
        <Skeleton key={index} className={className}/>
    ));
    return <div className='skeleton_wrapper w-100'>{skeletons}</div>;
}
export default SkeletonEffect