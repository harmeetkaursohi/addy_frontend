import SkeletonEffect from "../../../loader/skeletonEffect/SkletonEffect";
import {LineGraph} from "./LineGraph";

export const DashBoardReportLoader = ({isSocialMediaAccountLoading,isSocialMediaReportLoading,isGraphLoading}) => {

    return (
        <div>
            {
                isSocialMediaAccountLoading &&
                <div
                    className="d-flex gap-3 align-items-center postActivity_InnerWrapper dropdown_btn_Outer_container w-100">
                    <div className={"w-25"}><SkeletonEffect count={1}
                                                            className={"w-100 dashboard-report-social-media"}/>
                    </div>
                    <div className={"w-25"}><SkeletonEffect count={1}
                                                            className={"w-100 dashboard-report-social-media"}/>
                    </div>
                </div>
            }
            {
                isSocialMediaReportLoading &&
                <div className="followers_outer mt-4">


                    <div className="followers_wrapper text-start">
                        <h5>Followers</h5>
                        <div className="followers_inner_content">
                            <SkeletonEffect count={1} className={"w-25 dashboard-report-data-loader"}/>
                            <SkeletonEffect count={1} className={"w-100 mt-3"}/>

                        </div>
                    </div>
                    <div className="followers_wrapper text-start">
                        <h5>Account Reached</h5>
                        <div className="followers_inner_content">
                            <SkeletonEffect count={1} className={"w-25 dashboard-report-data-loader"}/>
                            <SkeletonEffect count={1} className={"w-100 mt-3"}/>

                        </div>
                    </div>

                    <div className="followers_wrapper text-start">
                        <h5>Post Activity</h5>
                        <div className="followers_inner_content">
                            <SkeletonEffect count={1} className={"w-25 dashboard-report-data-loader"}/>
                            <SkeletonEffect count={1} className={"w-100 mt-3"}/>

                        </div>
                    </div>

                </div>
            }

            {
                isGraphLoading &&
                <div className="page_title_header mb-0">
                    <div className="page_title_container">
                        <div className="page_title_dropdown">
                            <h3 className="cmn_white_text instagram_overview_heading"> Overview</h3>
                        </div>
                    </div>
                    <div className="account_info mt-2">
                        <LineGraph
                            reportData={[]}
                            isLoading={true}
                        />
                    </div>
                </div>

            }

        </div>
    )

}