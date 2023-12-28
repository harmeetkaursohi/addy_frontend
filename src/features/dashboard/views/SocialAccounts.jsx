import jsondata from "../../../locales/data/initialdata.json";
import {LoginSocialFacebook, LoginSocialLinkedin} from "reactjs-social-login";
import {
    computeAndSocialAccountJSONForFacebook,
    computeAndSocialAccountJSONForLinkedIn, extractIdFromLinkedinUrnId, getFormattedLinkedinObject,
    getInitialLetterCap, getLinkedInUrnId,
} from "../../../utils/commonUtils";
import {FacebookLoginButton, LinkedInLoginButton} from "react-social-login-buttons";
import fb_img from "../../../images/fb.svg";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    disconnectSocialAccountAction,
    getAllConnectedSocialAccountAction, getAllInstagramBusinessAccounts,
    socialAccountConnectActions
} from "../../../app/actions/socialAccountActions/socialAccountActions";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import {showErrorToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import ConnectPagesModal from "../../modals/views/ConnectPagesModal/ConnectPagesModal";
import {
    disconnectDisabledPages,
    getAllFacebookPages,
    getFacebookConnectedPages
} from "../../../app/actions/facebookActions/facebookActions";
import default_user_icon from "../../../images/default_user_icon.svg"
import {
    Linkedin_URN_Id_Types,
    NoInstagramBusinessAccountFound,
    SocialAccountProvider,
    SomethingWentWrong
} from "../../../utils/contantData";
import AccountAlreadyConnectedWarningModal from "./AccountAlreadyConnectedWarningModal";
import {getAllLinkedinPages, getAllPagesIds} from "../../../app/actions/linkedinActions/linkedinAction";

const SocialAccounts = () => {

    const enabledSocialMedia = {
        isFaceBookEnabled: `${import.meta.env.VITE_APP_ENABLE_FACEBOOK}` === "true",
        isInstagramEnabled: `${import.meta.env.VITE_APP_ENABLE_INSTAGRAM}` === "true",
        isLinkedinEnabled: `${import.meta.env.VITE_APP_ENABLE_LINKEDIN}` === "true",
        isPinterestEnabled: `${import.meta.env.VITE_APP_ENABLE_PINTEREST}` === "true",
    }
    const dispatch = useDispatch();
    const token = getToken();
    // const [checkForDisablePages, setCheckForDisablePages] = useState(true);
    const [currentConnectedFacebookPages, setCurrentConnectedFacebookPages] = useState(null);
    const [currentConnectedInstagramPages, setCurrentConnectedInstagramPages] = useState(null);
    const [currentConnectedLinkedinPages, setCurrentConnectedLinkedinPages] = useState(null);
    const [showAccountAlreadyConnectedWarningModal, setShowAccountAlreadyConnectedWarningModal] = useState(false);
    const [facebookDropDown, setFacebookDropDown] = useState(false);
    const [instagramDropDown, setInstagramDropDown] = useState(false);
    const [linkedinDropDown, setLinkedinDropDown] = useState(false);
    const [showFacebookModal, setShowFacebookModal] = useState(false);
    const [showInstagramModal, setShowInstagramModal] = useState(false);
    const [showLinkedinModal, setShowLinkedinModal] = useState(false);


    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const getAllFacebookPagesData = useSelector(state => state.facebook.getFacebookPageReducer);
    const instagramBusinessAccountsData = useSelector(state => state.socialAccount.getAllInstagramBusinessAccountsReducer);
    // const getAllLinkedinPagesData = useSelector(state => state.linkedin.getAllLinkedinPagesReducer);
    const getAllPagesIdsData = useSelector(state => state.linkedin.getAllPagesIdsReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const socialAccountConnectData = useSelector(state => state.socialAccount.connectSocialAccountReducer);

    const pagesData = {
        paging: {
            start: 0,
            count: 10,
            links: []
        },
        elements: [
            {
                roleAssignee: "urn:li:person:Rv7UWWQRxM",
                state: "APPROVED",
                role: "ADMINISTRATOR",
                organization: "urn:li:organization:100602804"
            },
            {
                roleAssignee: "urn:li:person:Rv7UWWQRxM",
                state: "APPROVED",
                role: "ADMINISTRATOR",
                organization: "urn:li:organization:100408588"
            }
        ]
    }
    const res = {
        payload: {...pagesData}
    }
    const profileData = {
        provider: "linkedin",
        data: {
            access_token: "AQVCG6sRabIKc-cv_In4WlsDXa-I1YH8xBUMTbY4mcEZUVHDjDVxOiyLSg0YN7i_4dKSBGqJ7YfnDrkfExO5pzM-cGeXVDZIrbkEt_B36QfXVzvRoS_r_yyChebD7N80UU1R-TrL8bH_cYEOkDOoQ1Lqn60xhIViDZOith1Xr68P8sw9iY-s8gQJLxbvdaBC-ZvhY5G3U-5MH7D94hpmqkTrfHES-p1nPD8YdHF4WkQlu-8xi5smoHZbV_5AHHfuSQcsM01f7mK-iiSaCrXE7LskfyjVTT27I8jA1Kvr39d-Q8th0E5iZ1Y6H8cmn9iooxdmnyzAkoiPQoCIFd0bFTdDG6ciUA",
            expires_in: 5183999,
            refresh_token: "",
            refresh_token_expires_in: 31536059,
            scope: "r_1st_connections_size,r_basicprofile,r_organization_followers,r_organization_social,r_organization_social_feed,rw_organization_admin,w_member_social,w_member_social_feed,w_organization_social,w_organization_social_feed",
            localizedLastName: "Language",
            // localizedLastName: "Ads",
            lastName: {
                localized: {
                    en_US: "Ads",
                },
                preferredLocale: {
                    country: "US",
                    language: "en",
                },
            },
            profilePicture: {
                displayImage: "urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g",
                "displayImage~": {
                    paging: {
                        count: 10,
                        start: 0,
                        links: [],
                    },
                    elements: [
                        {
                            artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_100_100)",
                            authorizationMethod: "PUBLIC",
                            data: {
                                "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                    orientation: "TopLeft",
                                    storageAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                    storageSize: {
                                        width: 96,
                                        height: 96,
                                    },
                                    rawMetadataTags: [],
                                    scale: "UNCHANGED",
                                    mediaType: "image/jpeg",
                                    rawCodecSpec: {
                                        name: "jpeg",
                                        type: "image",
                                    },
                                    displaySize: {
                                        width: 96,
                                        uom: "PX",
                                        height: 96,
                                    },
                                    displayAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                },
                            },
                            identifiers: [
                                {
                                    identifier: "https://media.licdn.com/dms/image/D4D03AQFOSfXuQw6s4g/profile-displayphoto-shrink_100_100/0/1699011711188?e=1707955200&v=beta&t=touVPBNg5NJzpjjRzYRgNBdutCsRc1SeQab_i9xL-cA",
                                    index: 0,
                                    mediaType: "image/jpeg",
                                    file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaArtifactClass:profile-displayphoto-shrink_100_100,0)",
                                    identifierType: "EXTERNAL_URL",
                                    identifierExpiresInSeconds: 1707955200,
                                },
                            ],
                        },
                        {
                            artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_200_200)",
                            authorizationMethod: "PUBLIC",
                            data: {
                                "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                    orientation: "TopLeft",
                                    storageAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                    storageSize: {
                                        width: 96,
                                        height: 96,
                                    },
                                    rawMetadataTags: [],
                                    scale: "UNCHANGED",
                                    mediaType: "image/jpeg",
                                    rawCodecSpec: {
                                        name: "jpeg",
                                        type: "image",
                                    },
                                    displaySize: {
                                        width: 96,
                                        uom: "PX",
                                        height: 96,
                                    },
                                    displayAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                },
                            },
                            identifiers: [
                                {
                                    identifier: "https://media.licdn.com/dms/image/D4D03AQFOSfXuQw6s4g/profile-displayphoto-shrink_200_200/0/1699011711188?e=1707955200&v=beta&t=mT4gA15nCH8htKFVn7HjJZpG_rUqMhK2n3P7ERD9g-M",
                                    index: 0,
                                    mediaType: "image/jpeg",
                                    file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaArtifactClass:profile-displayphoto-shrink_200_200,0)",
                                    identifierType: "EXTERNAL_URL",
                                    identifierExpiresInSeconds: 1707955200,
                                },
                            ],
                        },
                        {
                            artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_400_400)",
                            authorizationMethod: "PUBLIC",
                            data: {
                                "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                    orientation: "TopLeft",
                                    storageAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                    storageSize: {
                                        width: 96,
                                        height: 96,
                                    },
                                    rawMetadataTags: [],
                                    scale: "UNCHANGED",
                                    mediaType: "image/jpeg",
                                    rawCodecSpec: {
                                        name: "jpeg",
                                        type: "image",
                                    },
                                    displaySize: {
                                        width: 96,
                                        uom: "PX",
                                        height: 96,
                                    },
                                    displayAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                },
                            },
                            identifiers: [
                                {
                                    identifier: "https://media.licdn.com/dms/image/D4D03AQFOSfXuQw6s4g/profile-displayphoto-shrink_400_400/0/1699011711188?e=1707955200&v=beta&t=QkH-DiV-cA3hhJ57cUed3VgI-7-IjdDNsfDgYvHNqG4",
                                    index: 0,
                                    mediaType: "image/jpeg",
                                    file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaArtifactClass:profile-displayphoto-shrink_400_400,0)",
                                    identifierType: "EXTERNAL_URL",
                                    identifierExpiresInSeconds: 1707955200,
                                },
                            ],
                        },
                        {
                            artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaMediaArtifactClass:profile-displayphoto-shrink_800_800)",
                            authorizationMethod: "PUBLIC",
                            data: {
                                "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                    orientation: "TopLeft",
                                    storageAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                    storageSize: {
                                        width: 96,
                                        height: 96,
                                    },
                                    rawMetadataTags: [],
                                    scale: "UNCHANGED",
                                    mediaType: "image/jpeg",
                                    rawCodecSpec: {
                                        name: "jpeg",
                                        type: "image",
                                    },
                                    displaySize: {
                                        width: 96,
                                        uom: "PX",
                                        height: 96,
                                    },
                                    displayAspectRatio: {
                                        widthAspect: 1,
                                        heightAspect: 1,
                                        formatted: "1.00:1.00",
                                    },
                                },
                            },
                            identifiers: [
                                {
                                    identifier: "https://media.licdn.com/dms/image/D4D03AQFOSfXuQw6s4g/profile-displayphoto-shrink_800_800/0/1699011711188?e=1707955200&v=beta&t=Q9MLEwvr1MobiW5hAMQhWhPRbe4Xg0QomZUm4f86Kzg",
                                    index: 0,
                                    mediaType: "image/jpeg",
                                    file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4D03AQFOSfXuQw6s4g,urn:li:digitalmediaArtifactClass:profile-displayphoto-shrink_800_800,0)",
                                    identifierType: "EXTERNAL_URL",
                                    identifierExpiresInSeconds: 1707955200,
                                },
                            ],
                        },
                    ],
                },
            },
            firstName: {
                localized: {
                    en_US: "Addy",
                },
                preferredLocale: {
                    country: "US",
                    language: "en",
                },
            },
            id: "mTG3ICX7EI",
            // localizedFirstName: "Addy",
            localizedFirstName: "Code",
        },
    };
    const getAllLinkedinPagesData = {
        data: {
            results: {
                // 100623091: {},
                // 100412384: {},
                // 100602804: {
                //     logoV2: {
                //         original: "urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg",
                //         "original~": {
                //             paging: {
                //                 count: 10,
                //                 start: 0,
                //                 links: []
                //             },
                //             elements: [
                //                 {
                //                     artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaMediaArtifactClass:company-logo_200_200)",
                //                     authorizationMethod: "PUBLIC",
                //                     data: {
                //                         "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                //                             orientation: "TopLeft",
                //                             storageAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             },
                //                             storageSize: {
                //                                 width: 200,
                //                                 height: 200
                //                             },
                //                             rawMetadataTags: [],
                //                             scale: "DOWN",
                //                             mediaType: "image/jpeg",
                //                             rawCodecSpec: {
                //                                 name: "jpeg",
                //                                 type: "image"
                //                             },
                //                             displaySize: {
                //                                 width: 200.0,
                //                                 uom: "PX",
                //                                 height: 200.0
                //                             },
                //                             displayAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             }
                //                         }
                //                     },
                //                     identifiers: [
                //                         {
                //                             identifier: "https://media.licdn.com/dms/image/D4E0BAQGmGBijohOsJg/company-logo_200_200/0/1702468706145/code_language_logo?e=1710374400&v=beta&t=cd2jv09KGNdlrhP1F0tXktSVYfhmyItlFaWZ4CYPF_Q",
                //                             index: 0,
                //                             mediaType: "image/jpeg",
                //                             file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaArtifactClass:company-logo_200_200,0)",
                //                             identifierType: "EXTERNAL_URL",
                //                             identifierExpiresInSeconds: 1710374400
                //                         }
                //                     ]
                //                 },
                //                 {
                //                     artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaMediaArtifactClass:company-logo_100_100)",
                //                     authorizationMethod: "PUBLIC",
                //                     data: {
                //                         "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                //                             orientation: "TopLeft",
                //                             storageAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             },
                //                             storageSize: {
                //                                 width: 100,
                //                                 height: 100
                //                             },
                //                             rawMetadataTags: [],
                //                             scale: "DOWN",
                //                             mediaType: "image/jpeg",
                //                             rawCodecSpec: {
                //                                 name: "jpeg",
                //                                 type: "image"
                //                             },
                //                             displaySize: {
                //                                 width: 100.0,
                //                                 uom: "PX",
                //                                 height: 100.0
                //                             },
                //                             displayAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             }
                //                         }
                //                     },
                //                     identifiers: [
                //                         {
                //                             identifier: "https://media.licdn.com/dms/image/D4E0BAQGmGBijohOsJg/company-logo_100_100/0/1702468706145/code_language_logo?e=1710374400&v=beta&t=mjj6ksv-uB-oF1HEFTQBtW7FOHID1RKvVkCFUg9MMr4",
                //                             index: 0,
                //                             mediaType: "image/jpeg",
                //                             file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaArtifactClass:company-logo_100_100,0)",
                //                             identifierType: "EXTERNAL_URL",
                //                             identifierExpiresInSeconds: 1710374400
                //                         }
                //                     ]
                //                 },
                //                 {
                //                     artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaMediaArtifactClass:company-logo_400_400)",
                //                     authorizationMethod: "PUBLIC",
                //                     data: {
                //                         "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                //                             orientation: "TopLeft",
                //                             storageAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             },
                //                             storageSize: {
                //                                 width: 400,
                //                                 height: 400
                //                             },
                //                             rawMetadataTags: [],
                //                             scale: "UP",
                //                             mediaType: "image/jpeg",
                //                             rawCodecSpec: {
                //                                 name: "jpeg",
                //                                 type: "image"
                //                             },
                //                             displaySize: {
                //                                 width: 400.0,
                //                                 uom: "PX",
                //                                 height: 400.0
                //                             },
                //                             displayAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             }
                //                         }
                //                     },
                //                     identifiers: [
                //                         {
                //                             identifier: "https://media.licdn.com/dms/image/D4E0BAQGmGBijohOsJg/company-logo_400_400/0/1702468706145/code_language_logo?e=1710374400&v=beta&t=W4or5uz6oXkNh5NmDMqgMCha0omXEnIiQBS8hMNvXRo",
                //                             index: 0,
                //                             mediaType: "image/jpeg",
                //                             file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaArtifactClass:company-logo_400_400,0)",
                //                             identifierType: "EXTERNAL_URL",
                //                             identifierExpiresInSeconds: 1710374400
                //                         }
                //                     ]
                //                 }
                //             ]
                //         },
                //         "cropped~": {
                //             paging: {
                //                 count: 10,
                //                 start: 0,
                //                 links: []
                //             },
                //             elements: [
                //                 {
                //                     artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaMediaArtifactClass:company-logo_200_200)",
                //                     authorizationMethod: "PUBLIC",
                //                     data: {
                //                         "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                //                             orientation: "TopLeft",
                //                             storageAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             },
                //                             storageSize: {
                //                                 width: 200,
                //                                 height: 200
                //                             },
                //                             rawMetadataTags: [],
                //                             scale: "DOWN",
                //                             mediaType: "image/jpeg",
                //                             rawCodecSpec: {
                //                                 name: "jpeg",
                //                                 type: "image"
                //                             },
                //                             displaySize: {
                //                                 width: 200.0,
                //                                 uom: "PX",
                //                                 height: 200.0
                //                             },
                //                             displayAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             }
                //                         }
                //                     },
                //                     identifiers: [
                //                         {
                //                             identifier: "https://media.licdn.com/dms/image/D4E0BAQGmGBijohOsJg/company-logo_200_200/0/1702468706145/code_language_logo?e=1710374400&v=beta&t=cd2jv09KGNdlrhP1F0tXktSVYfhmyItlFaWZ4CYPF_Q",
                //                             index: 0,
                //                             mediaType: "image/jpeg",
                //                             file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaArtifactClass:company-logo_200_200,0)",
                //                             identifierType: "EXTERNAL_URL",
                //                             identifierExpiresInSeconds: 1710374400
                //                         }
                //                     ]
                //                 },
                //                 {
                //                     artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaMediaArtifactClass:company-logo_100_100)",
                //                     authorizationMethod: "PUBLIC",
                //                     data: {
                //                         "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                //                             orientation: "TopLeft",
                //                             storageAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             },
                //                             storageSize: {
                //                                 width: 100,
                //                                 height: 100
                //                             },
                //                             rawMetadataTags: [],
                //                             scale: "DOWN",
                //                             mediaType: "image/jpeg",
                //                             rawCodecSpec: {
                //                                 name: "jpeg",
                //                                 type: "image"
                //                             },
                //                             displaySize: {
                //                                 width: 100.0,
                //                                 uom: "PX",
                //                                 height: 100.0
                //                             },
                //                             displayAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             }
                //                         }
                //                     },
                //                     identifiers: [
                //                         {
                //                             identifier: "https://media.licdn.com/dms/image/D4E0BAQGmGBijohOsJg/company-logo_100_100/0/1702468706145/code_language_logo?e=1710374400&v=beta&t=mjj6ksv-uB-oF1HEFTQBtW7FOHID1RKvVkCFUg9MMr4",
                //                             index: 0,
                //                             mediaType: "image/jpeg",
                //                             file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaArtifactClass:company-logo_100_100,0)",
                //                             identifierType: "EXTERNAL_URL",
                //                             identifierExpiresInSeconds: 1710374400
                //                         }
                //                     ]
                //                 },
                //                 {
                //                     artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaMediaArtifactClass:company-logo_400_400)",
                //                     authorizationMethod: "PUBLIC",
                //                     data: {
                //                         "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                //                             orientation: "TopLeft",
                //                             storageAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             },
                //                             storageSize: {
                //                                 width: 400,
                //                                 height: 400
                //                             },
                //                             rawMetadataTags: [],
                //                             scale: "UP",
                //                             mediaType: "image/jpeg",
                //                             rawCodecSpec: {
                //                                 name: "jpeg",
                //                                 type: "image"
                //                             },
                //                             displaySize: {
                //                                 width: 400.0,
                //                                 uom: "PX",
                //                                 height: 400.0
                //                             },
                //                             displayAspectRatio: {
                //                                 widthAspect: 1.0,
                //                                 heightAspect: 1.0,
                //                                 formatted: "1.00:1.00"
                //                             }
                //                         }
                //                     },
                //                     identifiers: [
                //                         {
                //                             identifier: "https://media.licdn.com/dms/image/D4E0BAQGmGBijohOsJg/company-logo_400_400/0/1702468706145/code_language_logo?e=1710374400&v=beta&t=W4or5uz6oXkNh5NmDMqgMCha0omXEnIiQBS8hMNvXRo",
                //                             index: 0,
                //                             mediaType: "image/jpeg",
                //                             file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg,urn:li:digitalmediaArtifactClass:company-logo_400_400,0)",
                //                             identifierType: "EXTERNAL_URL",
                //                             identifierExpiresInSeconds: 1710374400
                //                         }
                //                     ]
                //                 }
                //             ]
                //         },
                //         cropped: "urn:li:digitalmediaAsset:D4E0BAQGmGBijohOsJg",
                //         cropInfo: {
                //             width: 0,
                //             x: 0,
                //             y: 0,
                //             height: 0
                //         }
                //     },
                //     vanityName: "code-language",
                //     localizedName: "Code Language"
                // },
                100408588: {
                    localizedName: "Addy Ads",
                    logoV2: {
                        original: "urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ",
                        "original~": {
                            paging: {
                                count: 10,
                                start: 0,
                                links: []
                            },
                            elements: [
                                {
                                    artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaMediaArtifactClass:company-logo_200_200)",
                                    authorizationMethod: "PUBLIC",
                                    data: {
                                        "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                            orientation: "TopLeft",
                                            storageAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            },
                                            storageSize: {
                                                width: 200,
                                                height: 200
                                            },
                                            rawMetadataTags: [],
                                            scale: "DOWN",
                                            mediaType: "image/jpeg",
                                            rawCodecSpec: {
                                                name: "jpeg",
                                                type: "image"
                                            },
                                            displaySize: {
                                                width: 200.0,
                                                uom: "PX",
                                                height: 200.0
                                            },
                                            displayAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            }
                                        }
                                    },
                                    identifiers: [
                                        {
                                            identifier: "https://media.licdn.com/dms/image/D4E0BAQF7ySc5WhFEoQ/company-logo_200_200/0/1700812482644/addy_ads_logo?e=1710374400&v=beta&t=H-V2Al0-xyUYLDwhPf9teUFSUpvJGacpOi5DbqsHGpU",
                                            index: 0,
                                            mediaType: "image/jpeg",
                                            file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaArtifactClass:company-logo_200_200,0)",
                                            identifierType: "EXTERNAL_URL",
                                            identifierExpiresInSeconds: 1710374400
                                        }
                                    ]
                                },
                                {
                                    artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaMediaArtifactClass:company-logo_100_100)",
                                    authorizationMethod: "PUBLIC",
                                    data: {
                                        "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                            orientation: "TopLeft",
                                            storageAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            },
                                            storageSize: {
                                                width: 100,
                                                height: 100
                                            },
                                            rawMetadataTags: [],
                                            scale: "DOWN",
                                            mediaType: "image/jpeg",
                                            rawCodecSpec: {
                                                name: "jpeg",
                                                type: "image"
                                            },
                                            displaySize: {
                                                width: 100.0,
                                                uom: "PX",
                                                height: 100.0
                                            },
                                            displayAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            }
                                        }
                                    },
                                    identifiers: [
                                        {
                                            identifier: "https://media.licdn.com/dms/image/D4E0BAQF7ySc5WhFEoQ/company-logo_100_100/0/1700812482644/addy_ads_logo?e=1710374400&v=beta&t=eAKvexZnncPTmhM9dwIG6dCpOoqaogHP9g_EiobKbNs",
                                            index: 0,
                                            mediaType: "image/jpeg",
                                            file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaArtifactClass:company-logo_100_100,0)",
                                            identifierType: "EXTERNAL_URL",
                                            identifierExpiresInSeconds: 1710374400
                                        }
                                    ]
                                },
                                {
                                    artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaMediaArtifactClass:company-logo_400_400)",
                                    authorizationMethod: "PUBLIC",
                                    data: {
                                        "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                            orientation: "TopLeft",
                                            storageAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            },
                                            storageSize: {
                                                width: 400,
                                                height: 400
                                            },
                                            rawMetadataTags: [],
                                            scale: "UP",
                                            mediaType: "image/jpeg",
                                            rawCodecSpec: {
                                                name: "jpeg",
                                                type: "image"
                                            },
                                            displaySize: {
                                                width: 400.0,
                                                uom: "PX",
                                                height: 400.0
                                            },
                                            displayAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            }
                                        }
                                    },
                                    identifiers: [
                                        {
                                            identifier: "https://media.licdn.com/dms/image/D4E0BAQF7ySc5WhFEoQ/company-logo_400_400/0/1700812482644/addy_ads_logo?e=1710374400&v=beta&t=fRBBYWm0gTW7UDPmcWjrGQJPilytoOgjfzgW-_zia7Y",
                                            index: 0,
                                            mediaType: "image/jpeg",
                                            file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaArtifactClass:company-logo_400_400,0)",
                                            identifierType: "EXTERNAL_URL",
                                            identifierExpiresInSeconds: 1710374400
                                        }
                                    ]
                                }
                            ]
                        },
                        "cropped~": {
                            paging: {
                                count: 10,
                                start: 0,
                                links: []
                            },
                            elements: [
                                {
                                    artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaMediaArtifactClass:company-logo_200_200)",
                                    authorizationMethod: "PUBLIC",
                                    data: {
                                        "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                            orientation: "TopLeft",
                                            storageAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            },
                                            storageSize: {
                                                width: 200,
                                                height: 200
                                            },
                                            rawMetadataTags: [],
                                            scale: "DOWN",
                                            mediaType: "image/jpeg",
                                            rawCodecSpec: {
                                                name: "jpeg",
                                                type: "image"
                                            },
                                            displaySize: {
                                                width: 200.0,
                                                uom: "PX",
                                                height: 200.0
                                            },
                                            displayAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            }
                                        }
                                    },
                                    identifiers: [
                                        {
                                            identifier: "https://media.licdn.com/dms/image/D4E0BAQF7ySc5WhFEoQ/company-logo_200_200/0/1700812482644/addy_ads_logo?e=1710374400&v=beta&t=H-V2Al0-xyUYLDwhPf9teUFSUpvJGacpOi5DbqsHGpU",
                                            index: 0,
                                            mediaType: "image/jpeg",
                                            file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaArtifactClass:company-logo_200_200,0)",
                                            identifierType: "EXTERNAL_URL",
                                            identifierExpiresInSeconds: 1710374400
                                        }
                                    ]
                                },
                                {
                                    artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaMediaArtifactClass:company-logo_100_100)",
                                    authorizationMethod: "PUBLIC",
                                    data: {
                                        "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                            orientation: "TopLeft",
                                            storageAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            },
                                            storageSize: {
                                                width: 100,
                                                height: 100
                                            },
                                            rawMetadataTags: [],
                                            scale: "DOWN",
                                            mediaType: "image/jpeg",
                                            rawCodecSpec: {
                                                name: "jpeg",
                                                type: "image"
                                            },
                                            displaySize: {
                                                width: 100.0,
                                                uom: "PX",
                                                height: 100.0
                                            },
                                            displayAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            }
                                        }
                                    },
                                    identifiers: [
                                        {
                                            identifier: "https://media.licdn.com/dms/image/D4E0BAQF7ySc5WhFEoQ/company-logo_100_100/0/1700812482644/addy_ads_logo?e=1710374400&v=beta&t=eAKvexZnncPTmhM9dwIG6dCpOoqaogHP9g_EiobKbNs",
                                            index: 0,
                                            mediaType: "image/jpeg",
                                            file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaArtifactClass:company-logo_100_100,0)",
                                            identifierType: "EXTERNAL_URL",
                                            identifierExpiresInSeconds: 1710374400
                                        }
                                    ]
                                },
                                {
                                    artifact: "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaMediaArtifactClass:company-logo_400_400)",
                                    authorizationMethod: "PUBLIC",
                                    data: {
                                        "com.linkedin.digitalmedia.mediaartifact.StillImage": {
                                            orientation: "TopLeft",
                                            storageAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            },
                                            storageSize: {
                                                width: 400,
                                                height: 400
                                            },
                                            rawMetadataTags: [],
                                            scale: "UP",
                                            mediaType: "image/jpeg",
                                            rawCodecSpec: {
                                                name: "jpeg",
                                                type: "image"
                                            },
                                            displaySize: {
                                                width: 400.0,
                                                uom: "PX",
                                                height: 400.0
                                            },
                                            displayAspectRatio: {
                                                widthAspect: 1.0,
                                                heightAspect: 1.0,
                                                formatted: "1.00:1.00"
                                            }
                                        }
                                    },
                                    identifiers: [
                                        {
                                            identifier: "https://media.licdn.com/dms/image/D4E0BAQF7ySc5WhFEoQ/company-logo_400_400/0/1700812482644/addy_ads_logo?e=1710374400&v=beta&t=fRBBYWm0gTW7UDPmcWjrGQJPilytoOgjfzgW-_zia7Y",
                                            index: 0,
                                            mediaType: "image/jpeg",
                                            file: "urn:li:digitalmediaFile:(urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ,urn:li:digitalmediaArtifactClass:company-logo_400_400,0)",
                                            identifierType: "EXTERNAL_URL",
                                            identifierExpiresInSeconds: 1710374400
                                        }
                                    ]
                                }
                            ]
                        },
                        cropped: "urn:li:digitalmediaAsset:D4E0BAQF7ySc5WhFEoQ",
                        cropInfo: {
                            width: 0,
                            x: 0,
                            y: 0,
                            height: 0
                        }
                    }
                }
            }
        }
    }

// Now you can use the 'profileData' object in your React application

    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
        }
    }, [token])


    useEffect(() => {

        if (enabledSocialMedia.isFaceBookEnabled && (!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length > 0) && getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK') !== undefined) {
            let faceBookSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK');
            dispatch(getAllFacebookPages({
                providerId: faceBookSocialAccount?.providerId,
                accessToken: faceBookSocialAccount?.accessToken
            })).then((res) => {
                const decodeJwt = decodeJwtToken(token);
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            })
        }
    }, [getAllConnectedSocialAccountData]);


    useEffect(() => {
        if (enabledSocialMedia.isInstagramEnabled && !getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'INSTAGRAM').length > 0) {
            let instagramSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'INSTAGRAM');
            dispatch(getAllInstagramBusinessAccounts({
                accessToken: instagramSocialAccount?.accessToken
            })).then((res) => {
                const decodeJwt = decodeJwtToken(token);
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            })
        }

    }, [getAllConnectedSocialAccountData]);

    useEffect(() => {
        if (enabledSocialMedia.isLinkedinEnabled && !getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'LINKEDIN').length > 0) {
            const decodeJwt = decodeJwtToken(token);
            let linkedinSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'LINKEDIN');
            // TODO: Remove if statement
            let x = false;
            if (x) {
                dispatch(getAllPagesIds({
                    accessToken: linkedinSocialAccount?.accessToken
                })).then((res) => {
                    if (res?.payload?.elements?.length === 0) {
                        dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
                    } else {
                        const requestBody = {
                            orgIds: res?.payload?.elements?.map(orgData => {
                                return extractIdFromLinkedinUrnId(orgData?.organization)
                            }).join(","),
                            accessToken: linkedinSocialAccount?.accessToken
                        }
                        dispatch(getAllLinkedinPages(requestBody)).then(res => {
                            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
                        })

                    }
                })
            }
        }

    }, [getAllConnectedSocialAccountData]);

    useEffect(() => {

        if (connectedPagesData?.facebookConnectedPages && Array.isArray(connectedPagesData?.facebookConnectedPages)) {
            const connectedLinkedInSocialAccount = getAllConnectedSocialAccountData?.data?.filter(socialAccount => socialAccount?.provider === "LINKEDIN")[0]
            const connectedLinkedInPages = connectedPagesData?.facebookConnectedPages?.filter(pageData => pageData?.socialMediaAccountId === connectedLinkedInSocialAccount?.id)
            const linkedinPages = (getAllLinkedinPagesData?.data?.results === null || getAllLinkedinPagesData?.data?.results === undefined) ? {} : getAllLinkedinPagesData?.data?.results
            const currentConnectedLinkedinPagesIds = Object.keys(linkedinPages)?.filter(LinkedinPageId =>
                connectedLinkedInPages?.some(linkedinPage => linkedinPage?.pageId === getLinkedInUrnId(LinkedinPageId, Linkedin_URN_Id_Types.ORGANIZATION))
            )
            const currentConnectedLinkedinPages = currentConnectedLinkedinPagesIds?.map(pageId => {
                return getFormattedLinkedinObject(pageId, linkedinPages[pageId]);
            })
            setCurrentConnectedLinkedinPages(currentConnectedLinkedinPages || null)
        }
    }, [connectedPagesData?.facebookConnectedPages]);

    useEffect(() => {
        if (connectedPagesData?.facebookConnectedPages && Array.isArray(connectedPagesData?.facebookConnectedPages)) {
            const connectedInstagramSocialAccount = getAllConnectedSocialAccountData?.data?.filter(socialAccount => socialAccount?.provider === "INSTAGRAM")[0]
            const connectedInstagramPages = connectedPagesData?.facebookConnectedPages?.filter(pageData => pageData?.socialMediaAccountId === connectedInstagramSocialAccount?.id)
            const currentConnectedInstagramPages = instagramBusinessAccountsData?.data?.filter(page =>
                connectedInstagramPages?.some(instaPage => instaPage?.pageId === page?.id)
            );
            setCurrentConnectedInstagramPages(currentConnectedInstagramPages || null);
            // List of pages to remove from the database incase user has deactivated page but it will still be present in our db
            // const pagesToRemove = connectedInstagramPages?.filter(page =>
            //     !instagramBusinessAccountsData?.data?.some(fbPage => fbPage?.id === page?.pageId)
            // );
            // if (!isNullOrEmpty(pagesToRemove)) {
            //     checkForDisablePages && removeDisabledPages(pagesToRemove)
            // } else {
            //     setCheckForDisablePages(false);
            // }

        }
    }, [connectedPagesData?.facebookConnectedPages]);

    useEffect(() => {

        if (connectedPagesData?.facebookConnectedPages && Array.isArray(connectedPagesData?.facebookConnectedPages)) {
            const connectedFacebookSocialAccount = getAllConnectedSocialAccountData?.data?.filter(socialAccount => socialAccount?.provider === "FACEBOOK")[0]
            const connectedFacebookPages = connectedPagesData?.facebookConnectedPages?.filter(pageData => pageData?.socialMediaAccountId === connectedFacebookSocialAccount?.id)
            const currentConnectedFaceBookPages = getAllFacebookPagesData?.facebookPageList?.filter(page =>
                connectedFacebookPages?.some(fbPage => fbPage?.pageId === page?.id)
            )
            setCurrentConnectedFacebookPages(currentConnectedFaceBookPages || null);
            // List of pages to remove from the database incase user has deactivated page but it will still be present in our db

            // const pagesToRemove = connectedFacebookPages?.filter(page =>
            //     !facebookPageList?.some(fbPage => fbPage?.id === page?.pageId)
            // );
            // if (!isNullOrEmpty(pagesToRemove)) {
            //     checkForDisablePages && removeDisabledPages(pagesToRemove)
            // } else {
            //     setCheckForDisablePages(false);
            // }
        }
    }, [connectedPagesData?.facebookConnectedPages]);


    const connectSocialMediaAccountToCustomer = (object) => {
        object.then((res) => {
            connectSocialMediaAccount(res);
        }).catch((error) => {
            showErrorToast(error.response.data.message);
        })
    }
    const connectInstagramAccountToCustomer = (data) => {
        connectSocialMediaAccount(data);
    }
    const connectSocialMediaAccount = (data) => {
        dispatch(socialAccountConnectActions(data)).then((response) => {
            if (response.meta.requestStatus === "rejected" && response.payload.status === 409) {
                setShowAccountAlreadyConnectedWarningModal(true)
            }
            dispatch(getAllConnectedSocialAccountAction(data))
            dispatch(getAllSocialMediaPostsByCriteria({
                token: token,
                query: {limit: 5, postStatus: ["SCHEDULED"]}
            }));
        })
    }

    // const removeDisabledPages = (disabledPages, x) => {
    //     const updatedData = disabledPages?.map(page => {
    //         return {
    //             pageId: page.pageId,
    //             name: page.name,
    //             imageUrl: page.imageUrl,
    //             access_token: page.access_token,
    //             socialMediaAccountId: page.socialMediaAccountId
    //         }
    //     })
    //     const requestBody = {
    //         token: token,
    //         pagesToDisconnect: updatedData
    //     }
    //     // dispatch(disconnectDisabledPages(requestBody)).then(res => {
    //     //     setCheckForDisablePages(false)
    //     // })
    //
    // }


    const disConnectSocialMediaAccountToCustomer = (socialMediaType) => {
        Swal.fire({
            icon: 'warning',
            title: `Disconnect ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} Account`,
            text: `Are you sure you want to disconnect your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} account?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
        }).then((result) => {
            if (result.isConfirmed) {
                switch (socialMediaType) {
                    case "FACEBOOK": {
                        currentConnectedInstagramPages?.length === 0 ? setInstagramDropDown(true) : setInstagramDropDown(false)
                        currentConnectedLinkedinPages?.length === 0 ? setLinkedinDropDown(true) : setLinkedinDropDown(false)
                        setCurrentConnectedFacebookPages([])
                        break;
                    }
                    case "INSTAGRAM": {
                        currentConnectedFacebookPages?.length === 0 ? setFacebookDropDown(true) : setFacebookDropDown(false)
                        currentConnectedLinkedinPages?.length === 0 ? setLinkedinDropDown(true) : setLinkedinDropDown(false)
                        setCurrentConnectedInstagramPages([])
                        break;
                    }
                    case "LINKEDIN": {
                        currentConnectedInstagramPages?.length === 0 ? setInstagramDropDown(true) : setInstagramDropDown(false)
                        currentConnectedFacebookPages?.length === 0 ? setFacebookDropDown(true) : setFacebookDropDown(false)
                        setCurrentConnectedLinkedinPages([])
                        break;
                    }
                }
                const decodeJwt = decodeJwtToken(token);
                dispatch(disconnectSocialAccountAction({
                    customerId: decodeJwt?.customerId,
                    socialMediaAccountId: getAllConnectedSocialAccountData?.data?.find(c => c.provider === socialMediaType)?.id,
                    token: token
                })).then((response) => {
                    dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt?.customerId, token: token}));
                    dispatch(getAllSocialMediaPostsByCriteria({
                        token: token,
                        query: {limit: 5, postStatus: ["SCHEDULED"]}
                    }));
                    Swal.fire({
                        icon: 'success',
                        title: `${getInitialLetterCap(SocialAccountProvider[socialMediaType])} Account Disconnected`,
                        text: `Your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} account has been disconnected successfully.`,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: '#F07C33',
                    });
                }).catch((error) => {
                    console.error('Error disconnecting Facebook account:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `An error occurred while disconnecting your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])}  account. Please try again later.`,
                    });
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled',
                    text: `Your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} account is still connected.`,
                    icon: 'info',
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#E6E9EC'
                });
            }
        });


    }

    const facebook = () => {
        setShowFacebookModal(true)
    }

    const commonButtonStyle = {
        borderRadius: '5px',
        background: "#F07C33",
        boxShadow: "unset",
        fontSize: "12px",
        color: "#fff",
        border: '1px solid #F07C33',
        height: "39px",
        minWidth: "111px",
        margin: "10px",
        width: "11px",
    };

    return (
        <div className="col-lg-5 col-xl-4 col-sm-12">

            {/* socail media */}
            <div className="cmn_background social_media_wrapper">
                <div className="social_media_account">
                    <h3>{jsondata.socialAccount}</h3>
                </div>

                {/*facebook connect starts */}

                {
                    enabledSocialMedia.isFaceBookEnabled &&
                    <>
                        {
                            getAllConnectedSocialAccountData?.loading ?
                                <SkeletonEffect count={1}></SkeletonEffect> :
                                getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0 ?

                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <i className={`fa-brands fa-facebook`}
                                               style={{color: "#0866ff", fontSize: "24px"}}/>
                                            <div>
                                                <h5 className="">Facebook account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>

                                        <LoginSocialFacebook
                                            isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                            appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                            redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                            onResolve={(response) => {
                                                setFacebookDropDown(true)
                                                setInstagramDropDown(false)
                                                setLinkedinDropDown(false)
                                                connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForFacebook(response, SocialAccountProvider.FACEBOOK))
                                            }}
                                            onReject={(error) => {
                                                console.log("error", error)

                                            }}>

                                            <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                                 icon={() => null} preventActiveStyles={true}
                                                                 style={commonButtonStyle}/>
                                        </LoginSocialFacebook>

                                    </div>

                                    :

                                    <div className=" cmn_drop_down dropdown">
                                        <div className="dropdown_header">
                                            <div className="social_media_outer">
                                                <div className="social_media_content"
                                                     onClick={() => setFacebookDropDown(!facebookDropDown)}
                                                >
                                                    <img className="cmn_width" src={fb_img}/>
                                                    <div className="text-start flex-grow-1">
                                                        <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'FACEBOOK')?.name || "facebook"}</h5>
                                                        <h4 className="connect_text cmn_text_style">Connected</h4>
                                                    </div>
                                                    {
                                                        (!getAllFacebookPagesData?.loading || !getAllConnectedSocialAccountData?.loading || !connectedPagesData?.loading) && currentConnectedFacebookPages?.length === 0 &&
                                                        <button className="DisConnectBtn cmn_connect_btn w-auto"
                                                                onClick={() => disConnectSocialMediaAccountToCustomer("FACEBOOK")}>
                                                            Disconnect
                                                        </button>
                                                    }
                                                    <div className={facebookDropDown ? "upside-down" : ""}>
                                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path id="Icon"
                                                                  d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                  stroke="#5F6D7E" strokeWidth="1.67"
                                                                  strokeLinecap="round"/>
                                                        </svg>

                                                    </div>


                                                </div>
                                            </div>

                                            {
                                                facebookDropDown === true &&

                                                <ul className="menu_items">
                                                    {
                                                        getAllFacebookPagesData?.loading ?
                                                            <SkeletonEffect count={3}/> :

                                                            currentConnectedFacebookPages?.length === 0 ?
                                                                <div className={"no-page-connected-outer text-center"}>
                                                                    <div>No active connections at the moment.</div>
                                                                    <div className={"cursor-pointer connect-page-btn"}
                                                                         onClick={() => facebook()}
                                                                    >Connect
                                                                        now
                                                                    </div>
                                                                </div> :
                                                                <>
                                                                    {
                                                                        currentConnectedFacebookPages?.map((data, index) => {
                                                                            return (
                                                                                <li key={index}>
                                                                                    <div
                                                                                        className="user_profileInfo_wrapper">
                                                                                        <div className="user_Details">
                                                                                            <img
                                                                                                src={data?.picture?.data?.url || default_user_icon}
                                                                                                height="30px"
                                                                                                width="30px"/>
                                                                                            <h4 className="cmn_text_style">{data.name}</h4>
                                                                                        </div>
                                                                                        <h4 className={"connect_text cmn_text_style"}>Connected</h4>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }

                                                                    <li>
                                                                        {
                                                                            (getAllFacebookPagesData?.facebookPageList && Array.isArray(getAllFacebookPagesData?.facebookPageList)) &&
                                                                            <div
                                                                                className="connectDisconnect_btn_outer">
                                                                                <button
                                                                                    className="DisConnectBtn cmn_connect_btn"
                                                                                    onClick={() => disConnectSocialMediaAccountToCustomer("FACEBOOK")}>
                                                                                    Disconnect
                                                                                </button>
                                                                                <button
                                                                                    className="ConnectBtn cmn_connect_btn"
                                                                                    onClick={() => facebook()}
                                                                                >
                                                                                    Connect More
                                                                                </button>
                                                                            </div>

                                                                        }
                                                                    </li>


                                                                </>


                                                    }


                                                </ul>}

                                        </div>
                                    </div>

                        }
                    </>
                }


                {/*facebook connect ends */}

                {/* start instagram connect */}
                {
                    enabledSocialMedia.isInstagramEnabled &&
                    <>
                        {
                            getAllConnectedSocialAccountData?.loading ?
                                <SkeletonEffect count={1}></SkeletonEffect> :
                                getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'INSTAGRAM').length === 0 ?
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <i className="fa-brands fa-instagram  insta-icon-color font-size-24"/>
                                            <div>
                                                <h5 className=""> Instagram account</h5>
                                                <h6 className="cmn_headings">www.instagram.com</h6>
                                            </div>
                                        </div>


                                        <LoginSocialFacebook
                                            isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                            appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                            redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                            onResolve={(response) => {
                                                setInstagramDropDown(true)
                                                setFacebookDropDown(false)
                                                setLinkedinDropDown(false)
                                                computeAndSocialAccountJSONForFacebook(response, SocialAccountProvider.INSTAGRAM).then((mediaAccount) => {
                                                    mediaAccount === null || mediaAccount === undefined ? showErrorToast(NoInstagramBusinessAccountFound) : connectInstagramAccountToCustomer(mediaAccount)
                                                })
                                            }}
                                            onReject={(error) => {
                                            }}>

                                            <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                                 icon={() => null} preventActiveStyles={true}
                                                                 style={commonButtonStyle}/>
                                        </LoginSocialFacebook>
                                    </div> :

                                    <div className=" cmn_drop_down dropdown">
                                        <div className="dropdown_header">
                                            <div className="social_media_outer">
                                                <div className="social_media_content"
                                                     onClick={() => setInstagramDropDown(!instagramDropDown)}>
                                                    <i className="fa-brands fa-instagram insta-icon-color font-size-24"/>
                                                    <div className="text-start flex-grow-1">
                                                        <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'INSTAGRAM')?.name || "instagram"}</h5>
                                                        <h4 className="connect_text cmn_text_style">Connected</h4>
                                                    </div>
                                                    {
                                                        (!getAllFacebookPagesData?.loading || !getAllConnectedSocialAccountData?.loading || !connectedPagesData?.loading) && currentConnectedInstagramPages?.length === 0 &&
                                                        <button className="DisConnectBtn cmn_connect_btn w-auto"
                                                                onClick={() => disConnectSocialMediaAccountToCustomer("INSTAGRAM")}>
                                                            Disconnect
                                                        </button>
                                                    }
                                                    <div className={instagramDropDown ? "upside-down" : ""}>
                                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path id="Icon"
                                                                  d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                  stroke="#5F6D7E" strokeWidth="1.67"
                                                                  strokeLinecap="round"/>
                                                        </svg>

                                                    </div>

                                                </div>
                                            </div>

                                            {
                                                instagramDropDown === true &&

                                                <ul className="menu_items">

                                                    {
                                                        instagramBusinessAccountsData?.loading ?
                                                            <SkeletonEffect count={3}/> :

                                                            currentConnectedInstagramPages?.length === 0 ?
                                                                <div className={"no-page-connected-outer text-center"}>
                                                                    <div>No active connections at the moment.</div>
                                                                    <div className={"cursor-pointer connect-page-btn"}
                                                                         onClick={() => setShowInstagramModal(true)}
                                                                    >Connect
                                                                        now
                                                                    </div>
                                                                </div> :
                                                                <>
                                                                    {
                                                                        currentConnectedInstagramPages?.map((data, index) => {
                                                                            return (
                                                                                <li key={index}>
                                                                                    <div
                                                                                        className="user_profileInfo_wrapper">
                                                                                        <div className="user_Details">
                                                                                            <img
                                                                                                src={data.profile_picture_url || default_user_icon}
                                                                                                height="30px"
                                                                                                width="30px"/>
                                                                                            <h4 className="cmn_text_style">{data.name}</h4>
                                                                                        </div>
                                                                                        <h4 className={"connect_text cmn_text_style"}>Connected</h4>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                    <li>
                                                                        {
                                                                            (instagramBusinessAccountsData?.data && Array.isArray(instagramBusinessAccountsData?.data)) &&
                                                                            <div
                                                                                className="connectDisconnect_btn_outer">
                                                                                <button
                                                                                    className="DisConnectBtn cmn_connect_btn"
                                                                                    onClick={() =>
                                                                                        disConnectSocialMediaAccountToCustomer("INSTAGRAM")}
                                                                                >
                                                                                    Disconnect
                                                                                </button>
                                                                                <button
                                                                                    className="ConnectBtn cmn_connect_btn"
                                                                                    onClick={() => setShowInstagramModal(true)}
                                                                                >
                                                                                    Connect More
                                                                                </button>
                                                                            </div>

                                                                        }
                                                                    </li>


                                                                </>


                                                    }
                                                </ul>}

                                        </div>
                                    </div>


                        }
                    </>
                }


                {/* end instagram connect */}

                {/* start linkedin connect */}

                {
                    enabledSocialMedia.isLinkedinEnabled &&
                    <>
                        {
                            getAllConnectedSocialAccountData?.loading ?
                                <SkeletonEffect count={1}></SkeletonEffect> :
                                getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'LINKEDIN').length === 0 ?
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <i className="fa-brands fa-linkedin linkedin-icon-color font-size-24"/>
                                            <div>
                                                <h5 className=""> Linkedin account</h5>
                                                <h6 className="cmn_headings">in.linkedin.com</h6>
                                            </div>
                                        </div>


                                        <LoginSocialLinkedin
                                            isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                            redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                            client_id={`${import.meta.env.VITE_APP_LINKEDIN_CLIENT_ID}`}
                                            client_secret={`${import.meta.env.VITE_APP_LINKEDIN_CLIENT_SECRET}`}
                                            scope={`${import.meta.env.VITE_APP_LINKEDIN_SCOPE}`}
                                            onResolve={(response) => {
                                                setLinkedinDropDown(true)
                                                setInstagramDropDown(false)
                                                setFacebookDropDown(false)
                                                connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForLinkedIn(response))
                                            }}
                                            onReject={(error) => {
                                                showErrorToast(SomethingWentWrong)
                                                console.log('error on reject of linkedin===>', error)
                                            }}>

                                            <LinkedInLoginButton text={"Connect"} className={"facebook_connect"}
                                                                 icon={() => null} preventActiveStyles={true}
                                                                 style={commonButtonStyle}/>
                                        </LoginSocialLinkedin>
                                    </div> :

                                    <div className=" cmn_drop_down dropdown">
                                        <div className="dropdown_header">
                                            <div className="social_media_outer">
                                                <div className="social_media_content"
                                                     onClick={() => setLinkedinDropDown(!linkedinDropDown)}>
                                                    <i className="fa-brands fa-linkedin linkedin-icon-color font-size-24"/>
                                                    <div className="text-start flex-grow-1">
                                                        <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'LINKEDIN')?.name || "linkedin"}</h5>
                                                        <h4 className="connect_text cmn_text_style">Connected</h4>
                                                    </div>

                                                    {
                                                        (!getAllFacebookPagesData?.loading || !getAllConnectedSocialAccountData?.loading || !connectedPagesData?.loading) && currentConnectedLinkedinPages?.length === 0 &&
                                                        <button
                                                            className="DisConnectBtn cmn_connect_btn w-auto"
                                                            onClick={() =>
                                                                disConnectSocialMediaAccountToCustomer("LINKEDIN")}>
                                                            Disconnect
                                                        </button>
                                                    }

                                                    <div className={linkedinDropDown ? "upside-down" : ""}>
                                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path id="Icon"
                                                                  d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                  stroke="#5F6D7E" strokeWidth="1.67"
                                                                  strokeLinecap="round"/>
                                                        </svg>

                                                    </div>

                                                </div>
                                            </div>

                                            {
                                                linkedinDropDown &&

                                                <ul className="menu_items">

                                                    {
                                                        (getAllPagesIdsData?.loading || getAllLinkedinPagesData?.loading) ?
                                                            <SkeletonEffect count={3}/> :

                                                            currentConnectedLinkedinPages?.length === 0 ?
                                                                <div className={"no-page-connected-outer text-center"}>
                                                                    <div>No active connections at the moment.</div>
                                                                    <div className={"cursor-pointer connect-page-btn"}
                                                                         onClick={() => setShowLinkedinModal(true)}
                                                                    >Connect
                                                                        now
                                                                    </div>
                                                                </div> :
                                                                <>
                                                                    {
                                                                        currentConnectedLinkedinPages?.map((data, index) => {
                                                                            return (
                                                                                <li key={index}>
                                                                                    <div
                                                                                        className="user_profileInfo_wrapper">
                                                                                        <div className="user_Details">
                                                                                            <img
                                                                                                src={data?.logo_url || default_user_icon}
                                                                                                height="30px"
                                                                                                width="30px"/>
                                                                                            <h4 className="cmn_text_style">{data?.name}</h4>
                                                                                        </div>
                                                                                        <h4 className={"connect_text cmn_text_style"}>Connected</h4>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                    <li>
                                                                        {
                                                                            (getAllLinkedinPagesData?.data && getAllLinkedinPagesData?.data?.results && Object.keys(getAllLinkedinPagesData?.data?.results)?.length > 0) &&
                                                                            <div
                                                                                className="connectDisconnect_btn_outer">
                                                                                <button
                                                                                    className="DisConnectBtn cmn_connect_btn"
                                                                                    onClick={() =>
                                                                                        disConnectSocialMediaAccountToCustomer("LINKEDIN")}>
                                                                                    Disconnect
                                                                                </button>
                                                                                <button
                                                                                    className="ConnectBtn cmn_connect_btn"
                                                                                    onClick={() => setShowLinkedinModal(true)}
                                                                                >
                                                                                    Connect More
                                                                                </button>
                                                                            </div>

                                                                        }
                                                                    </li>


                                                                </>


                                                    }
                                                </ul>}

                                        </div>
                                    </div>


                        }
                    </>
                }
                {/* end linkedin connect */}


            </div>
            {enabledSocialMedia.isFaceBookEnabled && showFacebookModal &&
                <ConnectPagesModal showModal={showFacebookModal} setShowModal={setShowFacebookModal}
                                   allPagesList={getAllFacebookPagesData?.facebookPageList}
                                   connectedPagesList={connectedPagesData?.facebookConnectedPages}
                                   noPageFoundMessage={"No Page Found!"}
                                   socialMediaType={SocialAccountProvider.FACEBOOK}
                                   socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "FACEBOOK")[0]}/>}
            {enabledSocialMedia.isInstagramEnabled && showInstagramModal &&
                <ConnectPagesModal showModal={showInstagramModal} setShowModal={setShowInstagramModal}
                                   allPagesList={instagramBusinessAccountsData?.data}
                                   connectedPagesList={connectedPagesData?.facebookConnectedPages}
                                   noPageFoundMessage={"No Page Found!"}
                                   socialMediaType={SocialAccountProvider.INSTAGRAM}
                                   socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "INSTAGRAM")[0]}/>}
            {enabledSocialMedia.isLinkedinEnabled && showLinkedinModal &&
                <ConnectPagesModal showModal={showLinkedinModal} setShowModal={setShowLinkedinModal}
                                   allPagesList={Object.keys(getAllLinkedinPagesData?.data?.results)?.map(key => {
                                       return getFormattedLinkedinObject(key, getAllLinkedinPagesData?.data?.results[key])
                                   })}
                                   connectedPagesList={connectedPagesData?.facebookConnectedPages}
                                   noPageFoundMessage={"No Page Found!"}
                                   socialMediaType={SocialAccountProvider.LINKEDIN}
                                   socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "LINKEDIN")[0]}/>}
            {
                showAccountAlreadyConnectedWarningModal &&
                <AccountAlreadyConnectedWarningModal showModal={showAccountAlreadyConnectedWarningModal}
                                                     setShowModal={setShowAccountAlreadyConnectedWarningModal}></AccountAlreadyConnectedWarningModal>
            }

        </div>

    );
}
export default SocialAccounts;