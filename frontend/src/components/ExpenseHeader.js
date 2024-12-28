import React from 'react';

const ExpenseHeader = ({ group }) => {
    return (
        <div
            style={{
                backgroundImage: `url(${group.imgURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className="w-screen max-w-full overflow-hidden bg-no-repeat h-[100px] md:h-[150px] lg:h-[200px]"
        >
            <div className="bg-black/50 p-8 md:p-12 lg:px-16 lg:py-24 h-full flex flex-col justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl uppercase">
                        {group.group_name}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHeader;
