import React from "react";
import GroupCard from "./GroupCard";

const GroupList = ({ groups, noGroupsMessage }) => {
    return (
        <div className="max-w-6xl mx-auto my-8">
            <div className="container mx-auto px-6">
                <div className="mt-16">
                    <h3 className="flex justify-center text-2xl text-slate-700 font-medium uppercase">
                        Groups
                    </h3>

                    {/* Mensaje cuando no hay grupos */}
                    {groups.length === 0 ? (
                        <p className="text-gray-500 text-lg text-center mt-10">
                            {noGroupsMessage}
                        </p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 mt-6">
                            {groups.map((group) => (
                                <GroupCard key={group.id} group={group} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupList;
