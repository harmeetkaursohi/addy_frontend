import SideBar from "../../sidebar/views/Layout"
import "./Review.css"
import jsondata from "../../../locales/data/initialdata.json"
import {SocialAccountProvider} from "../../../utils/contantData";
import {useCallback, useRef, useState} from "react";
import usePosts from "../../common/hooks/usePosts";

const Review = () => {

    const [baseSearchQuery, setBaseSearchQuery] = useState({});

    const [pageNum, setPageNum] = useState(1);
    const {
        isLoading,
        isError,
        error,
        results,
        hasNextPage
    } = usePosts(pageNum);

    console.log("@@@ results ", results);

    const intObserver = useRef();
    const lastPostRef = useCallback(post => {
        if (isLoading) return

        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                console.log('We are near the last post!')
                setPageNum(prev => prev + 1)
            }
        })

        if (post) intObserver.current.observe(post)
    }, [isLoading, hasNextPage]);


    if (isError) return <p className='center'>Error: {error.message}</p>

    return (
        <>
            <section>
                <SideBar/>
                <div className="comment_container">
                    <div className="cmn_wrapper_outer">
                        <div className="review_wrapper">
                            <div className="review_header">
                                <div className="review_heading">
                                    <h2 className="cmn_text_heading">{jsondata.likecomment}</h2>
                                    <h6 className="cmn_small_heading">Here you find all the upcoming Posts you
                                        scheduled.</h6>
                                </div>
                                <select className="filter_select_btn cmn_text_style"
                                        value={baseSearchQuery?.socialAccountType}
                                        onChange={(e) => {
                                            setBaseSearchQuery({
                                                ...baseSearchQuery,
                                                socialAccountType: e.target.value === "All" ? null : e.target.value
                                            });
                                        }}
                                >
                                    <option value={"All"}>All</option>
                                    {Object.keys(SocialAccountProvider).map((cur) => {
                                        return (<option value={cur}>{SocialAccountProvider[cur]}</option>)
                                    })}
                                </select>
                            </div>

                            <div className="post_review_wrapper ">

                                <table className={"review_data"}>

                                    <thead className="table-responsive position-sticky" style={{top: "0"}}>
                                    <tr>
                                        <th>UserId</th>
                                        <th>Id</th>
                                        <th>Title</th>
                                        <th>Body</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {results?.map((post, index) => (
                                        <tr
                                            key={index}
                                            ref={index === results.length - 1 ? lastPostRef : null}
                                        >
                                            <td>{post?.userId}</td>
                                            <td>{post?.id}</td>
                                            <td>{post?.title}</td>
                                            <td>{post?.body}</td>
                                        </tr>
                                    ))}

                                    </tbody>

                                </table>

                            </div>

                            <div className={"m-auto mt-5"}>
                                {isLoading && <p className="text-center">Loading More Posts...</p>}
                                {<p className="text-center"><a href="#top">Back to Top</a></p>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Review