import polygon_img from "../../../../images/polygon.svg";

export const DashBoardReportLoader = () => {

    return (

        <div className="followers_outer mt-4">

            <div className="followers_wrapper">
                <h5>Followers</h5>
                <div className="followers_inner_content">
                    <h2><i className="fa fa-spinner fa-spin"/></h2>
                    <div className="monthly_growth">
                        <button className="cmn_followers_btn">
                            {/* <img src={polygon_img} className="polygon_img"/> */}
                            <i className="fa fa-spinner fa-spin"/>
                        </button>
                    </div>
                </div>
            </div>


            <div className="followers_wrapper ">
                <h5>Account Reached</h5>
                <div className="followers_inner_content">
                    <h2><i className="fa fa-spinner fa-spin"/></h2>
                    <div className="monthly_growth">
                        <button className="cmn_followers_btn">
                            {/* <img src={polygon_img} className="polygon_img"/> */}
                            <i className="fa fa-spinner fa-spin"/>
                        </button>
                        {/* <h6 className="cmn_headings">{jsondata.monthlyGrowth}</h6> */}
                    </div>
                </div>
            </div>

            <div className="followers_wrapper ">
                <h5>Post Activity</h5>
                <div className="followers_inner_content">
                    <h2><i className="fa fa-spinner fa-spin"/></h2>
                    <div className="monthly_growth">
                        <button className="cmn_followers_btn">
                            {/* <img src={polygon_img} className="polygon_img"/> */}
                            <i className="fa fa-spinner fa-spin"/>
                        </button>
                    </div>
                </div>
            </div>

        </div>


    )

}