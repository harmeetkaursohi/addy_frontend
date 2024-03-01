import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();


export const AppProvider = ({ children }) => {
    const [sidebar, setSidebar] = useState(true);

    const show_sidebar = () => {
        setSidebar(!sidebar);
    };

    return (
        <AppContext.Provider value={{ sidebar, show_sidebar }}>
            {children}
        </AppContext.Provider>
    );
};

// 3. Consume the Context
export const useAppContext = () => useContext(AppContext);