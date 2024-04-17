import {toast} from 'react-toastify';
import './Toast.css'

export function showErrorToast(content) {
    buildCustomToastTemplate("toast_sub_child_", "fa fa-ban", "Error", content, {
        className: "cust_toast_error",
        autoClose: true,
        bodyClassName: "toast_child",
        closeOnClick: false,
        draggable: true,
        position: "top-right",
        hideProgressBar: false,
        progressStyle: {background: 'hsl(353.59deg 62.68% 40.98%)'},
        limit: 1,
        toastId: 'error'
    })
}

export function showSuccessToast(content) {
    buildCustomToastTemplate("toast_sub_child_", "fa fa-check", "Success", content, {
        className: "cust_toast_success",
        autoClose: true,
        bodyClassName: "toast_child",
        closeOnClick: false,
        draggable: true,
        position: "top-right",
        hideProgressBar: false,
        progressStyle: {background: "#5d7151"},
        limit: 1,
        toastId: 'success'
    })

}


export function showWarningToast(content) {
    buildCustomToastTemplate("toast_sub_child_", "fa fa-warning", "Warning", content, {
        className: "cust_toast_warning",
        autoClose: true,
        bodyClassName: "toast_child",
        closeOnClick: false,
        draggable: false,
        position: "top-right",
        hideProgressBar: false,
        progressStyle: {background: "hsl(39.78deg 48.63% 35.88%)"},
        limit: 1,
        toastId: 'yellow'
    })
}

export function showInfoToast(content) {
    buildCustomToastTemplate("toast_sub_child_", "fas fa-info-circle", "Info", content, {
        className: "cust_toast_info",
        autoClose: true,
        bodyClassName: "toast_child",
        closeOnClick: false,
        draggable: true,
        position: "top-right",
        hideProgressBar: false,
        progressStyle: {background: "hsl(203.7deg 41.12% 38.63%)"},
        limit: 1,
        toastId: 'info'
    })
}


export function buildCustomToastTemplate(parent_div_class = "toast_sub_child_", icon_tag_type, span_bold, span_content_, options = {}) {
    if (toast.isActive(options.toastId)) {

        options.render = <>
            <div className={parent_div_class}>
                <i className={icon_tag_type} style={{marginRight: '10px'}}/>
                <span><b>{span_bold}: </b><span className="toast_message">{span_content_}</span></span>
            </div>
        </>;
        toast.update(options.toastId, options)
    } else {
        toast(<>
            <div className={parent_div_class}>
                <i className={icon_tag_type} style={{marginRight: '10px'}}/>
                <span><b>{span_bold}: </b><span className="toast_message">{span_content_}</span></span>
            </div>
        </>, options)
    }

}