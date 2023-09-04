import search_icon from "../../../images/search_icon.svg"
import  jsondata  from "../../../locales/data/initialdata.json"
import './Header.css'
const Header=()=>{
    return(
        <>
        <header>
            <div className="header_outer">
                <form>
                <div className="row">
                    <div className="col-lg-5 col-md-12 col-sm-12">
                     <div className="header_outer_container">
                     <div className="header_container">
                     <h2 className="">{jsondata.heythere} Pritpal Singh!</h2>
                     <h6>Welcome back to your all in Dashboard and more text here!</h6>
                     </div>
                     </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12" >
                    <div className="search_outer">
                        <img src={search_icon} className="search_icon"/>
                        <input type="text" className="form-control search_input" placeholder="Search" />
                     </div>
                    </div>
                    <div className="col-lg-3 col-md-12 col-sm-12">
                        <div className="create_Ad_outer">
                        <button className="Create_Ad_btn crate_btn">
                           {jsondata.createad}
                            </button>
                            <button className="createPost_btn crate_btn cmn_btn_color ">
                            {jsondata.createpost}
                            </button>
                        </div>
                    </div>
                </div>

                </form>
            </div>
        </header>
        </>
    )
}
export default Header