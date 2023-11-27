import React from "react";
import FacebookFeedPreview from "./FacebookFeedPreview";
import InstagramFeedPreview from "./InstagramFeedPreview";

const CommonFeedPreview = ({
                               socialMediaType,
                               previewTitle,
                               pageName,
                               userData,
                               files,
                               selectedFileType,
                               caption,
                               hashTag,
                           }) => {
    return (
        <>
            {
                socialMediaType === "FACEBOOK" &&
                <FacebookFeedPreview
                    previewTitle={previewTitle}
                    pageName={pageName}
                    userData={userData}
                    files={files}
                    selectedFileType={selectedFileType}
                    caption={caption}
                    hashTag={hashTag}
                />
            }

            {
                socialMediaType === "INSTAGRAM" &&
                <InstagramFeedPreview
                    previewTitle={previewTitle}
                    pageName={pageName}
                    userData={userData}
                    files={files}
                    selectedFileType={selectedFileType}
                    caption={caption}
                    hashTag={hashTag}
                />
            }
        </>
    )
}

export default CommonFeedPreview;