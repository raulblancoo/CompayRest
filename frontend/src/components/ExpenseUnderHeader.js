import React from 'react';
import { useTranslation } from "react-i18next";

const ExpenseUnderHeader = ({ onAddMember, onShowDebts }) => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center mb-6 mt-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                    type="button"
                    onClick={onAddMember}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-400 rounded-s-lg hover:bg-gray-100 hover:text-sky-500 focus:z-10 focus:ring-2 focus:ring-sky-500 focus:text-sky-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                    </svg>
                    <span className="ml-2">{t('add_member')}</span>
                </button>
                <button
                    type="button"
                    onClick={onShowDebts}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-400 rounded-e-lg hover:bg-gray-100 hover:text-sky-500 focus:z-10 focus:ring-2 focus:ring-sky-500 focus:text-sky-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                        />
                    </svg>
                    <span className="ml-2">{t('show_debts')}</span>
                </button>
            </div>
        </div>
    );
};

export default ExpenseUnderHeader;
