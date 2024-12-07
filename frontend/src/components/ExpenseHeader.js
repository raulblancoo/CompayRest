import React from 'react';

const ExpenseHeader = ({ group }) => {
    return (
        <div
            style={{ backgroundImage: `url(${group.imgURL})` }}
            className="overflow-hidden bg-cover bg-top bg-no-repeat h-[100px] md:h-[150px] lg:h-[200px]"
        >
            <div className="bg-black/50 p-8 md:p-12 lg:px-16 lg:py-24 h-full flex flex-col justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl uppercase">
                        {group.groupName}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHeader;