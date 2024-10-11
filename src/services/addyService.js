import {fetchEventSource} from "@microsoft/fetch-event-source";
import {getToken, setAuthenticationHeader} from "../app/auth/auth";
import {Events} from "../utils/contantData";
import {increaseUnseenNotificationsCount, notificationEventData,unseenNotificationsCount} from "../app/globalSlice/globalSlice";
import {addyApi} from "../app/addyApi";

export const subscribeNotifications = async (dispatch) => {
    await fetchEventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/notification/trigger`, {
        method: "GET",
        headers: setAuthenticationHeader(getToken()).headers,
        onopen(res) {
            if (res.ok && res.status === 200) {
                console.log("Connection made ", res);
            }
            if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                console.log("Client side error ", res);
            }
        },
        onmessage(event) {
            const data = JSON.parse(event.data)
            switch (event.event) {
                case Events.NOTIFICATION_EVENT: {
                    dispatch(addyApi.util.invalidateTags(["getUnseenNotificationsApi","searchNotificationsApi"]))
                    dispatch(notificationEventData([data]))
                    dispatch(increaseUnseenNotificationsCount({count: 1}))
                    break;
                }
                case Events.UNSEEN_NOTIFICATIONS_COUNT_EVENT : {
                    dispatch(addyApi.util.invalidateTags(["getUnseenNotificationsApi","searchNotificationsApi"]))
                    dispatch(unseenNotificationsCount(data))
                    break;
                }
            }

        },
        onclose() {
            console.log("Connection closed by the server");
        },
        onerror(err) {
            console.log("There was an error from server", err);
        },
    });
};