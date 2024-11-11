import React from "react";
import "./GraphLoader.css"

const GraphLoader = () => {
    return (
        <div className="loading-overlay">
                        <span className="loading-text">
                             <div className="loader">Loading
                                  <span className="loader__dot">.</span>
                                    <span className="loader__dot">.</span>
                                   <span className="loader__dot">.</span>
                             </div>
                         </span>
        </div>
    );
}

export default GraphLoader