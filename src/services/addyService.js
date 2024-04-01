import {fetchEventSource} from "@microsoft/fetch-event-source";
import {getToken, setAuthenticationHeader} from "../app/auth/auth";
import {
    increaseUnseenNotificationsCountData,
    notificationEventData,
    unseenNotificationsCountData
} from "../app/slices/notificationSlice/notificationSlice";
import {Events} from "../utils/contantData";

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
                    dispatch(notificationEventData([data]))
                    dispatch(increaseUnseenNotificationsCountData({count: 1}))
                    break;
                }
                case Events.UNSEEN_NOTIFICATIONS_COUNT_EVENT : {
                    dispatch(unseenNotificationsCountData(data))
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