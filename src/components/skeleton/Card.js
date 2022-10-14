import { Skeleton } from '@mui/material';
import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="row my-3">
            <div className="col-md-4 col-sm-6 pe-2 ps-2" >
                <Skeleton variant="rectangular" height={118} />
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} /> 
                
            </div>
            <div className="col-md-4 col-sm-6 pe-2 ps-2" >
                <Skeleton variant="rectangular" height={118} />
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </div>
            <div className="col-md-4 col-sm-6 pe-2 ps-2" >
                <Skeleton variant="rectangular" height={118} />
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </div>
        </div>
    );
}
