import React, {useState, useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import './faq.css'
import {list} from "../../app/actions/webActions/webActions";
import {useDispatch, useSelector} from "react-redux";
import {resetReducers} from "../../app/actions/commonActions/commonActions";
import {useAppContext} from "../common/components/AppProvider";
import jsondata from "../../locales/data/initialdata.json"
const FaqComponent = () => {
    const dispatch = useDispatch();
    const faqList = useSelector(state => state.web.listReducer);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    useEffect(() => {
        handleLoadMore();
        return () => {
            dispatch(resetReducers({sliceNames: ["listReducer"]}))
        }
    }, [search]);
    useEffect(() => {
        if (faqList.data) {
            page === 1 ? setItems(faqList.data) : setItems((prevItems) => ([...prevItems, ...faqList.data]))
            if (faqList.data.length && faqList.hasNextPage) setPage(prevPage => prevPage + 1);
        }
        setSearchLoading(false)
    }, [faqList]);
    const handleLoadMore = () => {
        dispatch(list({page, search}));
    }
    const {sidebar} = useAppContext()

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
                                                disabled={faqList.loading || searchLoading}
                                                style={{opacity: (faqList.loading || searchLoading) ? "0.6" : "1.0"}}>
                                            {(faqList.loading || searchLoading) ? (
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
                                    {(items.length && faqList.hasNextPage) || (faqList.loading && !faqList.hasNextPage) ?
                                        <button type="button" className="load-more-faqs-btn" onClick={handleLoadMore}
                                                disabled={faqList.loading}> {faqList.loading ? 'Loading...' : 'Load More'}</button> : ""}
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