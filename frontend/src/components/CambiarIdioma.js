import React from 'react';
import { useTranslation } from 'react-i18next';

const CambiarIdioma = () => {
    const { i18n, t } = useTranslation();

    const cambiarIdioma = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className="flex justify-end p-4">
            <span className="mr-2 text-blue-900">{t('language')}:</span>
            <button
                onClick={() => cambiarIdioma('es')}
                className={`px-3 py-1 rounded ${i18n.language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
                {t('spanish')}
            </button>
            <button
                onClick={() => cambiarIdioma('en')}
                className={`ml-2 px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
                {t('english')}
            </button>
        </div>
    );
};

export default CambiarIdioma;
