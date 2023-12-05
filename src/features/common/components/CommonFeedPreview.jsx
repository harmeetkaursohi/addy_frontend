import React from "react";
import FacebookFeedPreview from "./FacebookFeedPreview";
import InstagramFeedPreview from "./InstagramFeedPreview";

const CommonFeedPreview = ({
                               socialMediaType,
                               pageImageUrl,
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
                    pageImage={pageImageUrl}
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
                    pageImage={pageImageUrl}
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