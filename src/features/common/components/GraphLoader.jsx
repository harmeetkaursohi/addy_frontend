import React from "react";
import "./GraphLoader.css"

const GraphLoader = () => {
    return (
        <div className="loading-overlay">
                        <span className="loading-text">
                             <div class="loader">Loading
                                  <span class="loader__dot">.</span>
                                    <span class="loader__dot">.</span>
                                   <span class="loader__dot">.</span>
                             </div>
                         </span>
        </div>
    );
}

export default GraphLoader