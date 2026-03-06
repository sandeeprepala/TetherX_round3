import React from 'react';
import Spline from '@splinetool/react-spline';

export const MedicalModel = () => {
    return (
        <div className="w-full h-full flex items-center justify-center relative scale-125 z-10 pointer-events-auto mt-10">
            <Spline
                scene="https://prod.spline.design/5aOq2B-JW16VbGYg/scene.splinecode"
            />
        </div>
    );
};
