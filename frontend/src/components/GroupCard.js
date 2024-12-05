import React from "react";
import { Link } from "react-router-dom";

const GroupCard = ({ group }) => {
    if (!group) return null;

    return (
        <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
            <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{ backgroundImage: `url(${group.imgURL})` }}
            >
                <Link
                    to={`/groups/${group.id}/expenses`} // URL dinámica
                    className="p-2 flex justify-center items-center rounded-full bg-sky-500 text-white mx-5 -mb-4 hover:bg-cyan-700 focus:outline-none focus:bg-blue-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 ml-3"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                    </svg>
                    <span className="mx-1 uppercase">{group.group_name}</span>
                </Link>
            </div>
            <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">{group.group_name}</h3>
                <span className="text-slate-600 mt-2">
                    {group.amount}{" "}
                    {group.currency === "EURO" ? "€" : group.currency === "DOLAR" ? "$" : group.currency}
                </span>
            </div>
        </div>
    );
};

export default GroupCard;
