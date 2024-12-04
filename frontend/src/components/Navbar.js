import React from "react";

const Navbar = () => {
    return (
        <nav className="bg-white shadow">
            <div className="shadow px-5">
                <div className="flex justify-between items-center h-16 max-w-6xl mx-auto">
                    <div className="block sm:invisible">
                        <button
                            data-collapse-toggle="navbar-collapse"
                            type="button"
                            className="text-slate-500 hover:bg-sky-500 hover:text-slate-100 transition-colors rounded p-1 -ml-1 focus:ring-2"
                            aria-controls="navbar-collapse"
                            aria-expanded="false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center">
                        <a className="text-sky-500 hover:rotate-6 duration-200" href="/groups">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </a>
                        <div className="space-x-6 ml-6 hidden sm:flex">
                            <a href="/groups" className="text-sky-500 px-3 py-2">
                                Groups
                            </a>
                            <a href="/expenses" className="text-slate-700 px-3 py-2 hover:text-sky-500 transition-colors">
                                Payments
                            </a>
                            <a href="/debts" className="text-slate-700 px-3 py-2 hover:text-sky-500 transition-colors">
                                Debts
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
