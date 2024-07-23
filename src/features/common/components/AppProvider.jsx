import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();


export const AppProvider = ({ children }) => {
    const [sidebar, setSidebar] = useState(false);

    const show_sidebar = () => {
        setSidebar(!sidebar);
    };
     
    useEffect(() => {
        const handleResize = () => {

            if (window.innerWidth <= 767) { 
                setSidebar(true)
            }else{
                setSidebar(false)
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerWidth])
    return (
        <AppContext.Provider value={{ sidebar, show_sidebar }}>
            {children}
        </AppContext.Provider>
    );
};

// 3. Consume the Context
export const useAppContext = () => useContext(AppContext);