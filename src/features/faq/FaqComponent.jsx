import React, {useState, useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import './faq.css'
import {useDispatch} from "react-redux";
import {useAppContext} from "../common/components/AppProvider";
import jsondata from "../../locales/data/initialdata.json"
import {addyApi} from "../../app/addyApi";
import {useLazyFaqListQuery} from "../../app/apis/webApi";
const FaqComponent = () => {

    const {sidebar} = useAppContext()

    const dispatch = useDispatch();

    const [faqList,getFaqListApi]=useLazyFaqListQuery()
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);


    useEffect(() => {
        handleLoadMore();
        return () => {
            dispatch(addyApi.util.invalidateTags(["getFaqListApi"]))
        }
    }, [search]);

    useEffect(() => {
        if (getFaqListApi.data) {
            page === 1 ? setItems(getFaqListApi.data) : setItems((prevItems) => ([...prevItems, ...getFaqListApi.data]))
            if (getFaqListApi.data.length && getFaqListApi.hasNextPage) setPage(prevPage => prevPage + 1);
        }
        setSearchLoading(false)
    }, [getFaqListApi]);

    const handleLoadMore = () => {
        faqList({page:page, search:search})
    }


    return (
        <>
            <div className={`cmn_container faq_section  ${sidebar ? "" : "cmn_Padding"}`}>

                <div className="cmn_outer">
                    <div className="white_bg_color cmn_height_outer faq_container">
                        <div className="faq_wrapper">
                            <h2 className="text-center mt-5">{jsondata.faq_heading}<br></br> {jsondata.how_can_we_help_you_text}</h2>
                            <p className="pt-2 text-center">{jsondata.faq_title}</p>
                            <form method="post" onSubmit={function (e) {
                                e.preventDefault();
                                setPage(1);
                                setSearch(document.getElementById("searchText").value);
                                return false;
                            }}>
                                <div className="faq_searchbar">
                                    <input type="text" placeholder="Search..." id="searchText"
                                           className="search-faqs-input"/>
                                    <div className="submit_Button_Wrapper">
                                        <button type="submit" className={"cmn_btn_color"}
                                                disabled={getFaqListApi.isLoading || getFaqListApi?.isFetching || searchLoading}
                                                style={{opacity: (getFaqListApi.isLoading || getFaqListApi?.isFetching  || searchLoading) ? "0.6" : "1.0"}}>
                                            {(getFaqListApi.isLoading || getFaqListApi?.isFetching  || searchLoading) ? (
                                                <span className="spinner-border spinner-border-sm me-1" role="status"
                                                      aria-hidden="true"/>) : 'Submit'}
                                        </button>

                                    </div>
                                </div>
                            </form>
                            <div className="accordian_wrapper">
                                {items.length ? <Accordion defaultActiveKey="0">
                                    {items.map(function (v, i) {
                                        return (<Accordion.Item eventKey={i} key={i}>
                                            <Accordion.Header>{v.title.rendered}</Accordion.Header>
                                            <Accordion.Body>
                                                <div dangerouslySetInnerHTML={{__html: v.content.rendered}}/>
                                            </Accordion.Body>
                                        </Accordion.Item>)
                                    })
                                    }
                                </Accordion> : (<div>FAQ's not found.</div>)}
                                <div className="load-more-faqs-container">
                                    {
                                        (items.length && getFaqListApi.hasNextPage) || ((getFaqListApi.isLoading || getFaqListApi?.isFetching)  && !getFaqListApi.hasNextPage) ?
                                        <button type="button" className="load-more-faqs-btn" onClick={handleLoadMore}
                                                disabled={getFaqListApi.isLoading || getFaqListApi.isLoading || getFaqListApi?.isFetching}> {getFaqListApi.isLoading || getFaqListApi.isLoading || getFaqListApi?.isFetching ? 'Loading...' : 'Load More'}</button> : ""
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default FaqComponent;