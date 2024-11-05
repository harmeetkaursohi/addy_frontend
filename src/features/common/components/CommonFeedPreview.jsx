import React from "react";
import FacebookFeedPreview from "./FacebookFeedPreview";
import InstagramFeedPreview from "./InstagramFeedPreview";
import PinterestFeedPreview from "./PinterestFeedPreview";
import LinkedinFeedpreview from "./LinkedinFeedPreview";
import DefaultFeedPreview from "./DefaultFeedPreview";

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
                               destinationUrl=null,
                               pinTitle=null,
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

            {
                socialMediaType === "PINTEREST" &&
                <PinterestFeedPreview
                    previewTitle={previewTitle}
                    pageName={pageName}
                    pageImage={pageImageUrl}
                    userData={userData}
                    files={files}
                    selectedFileType={selectedFileType}
                    caption={caption}
                    hashTag={hashTag}
                    destinationUrl={destinationUrl}
                    pinTitle={pinTitle}
                />
            }
            {
                socialMediaType === "LINKEDIN" &&
                <LinkedinFeedpreview
                    previewTitle={previewTitle}
                    pageName={pageName}
                    pageImage={pageImageUrl}
                    userData={userData}
                    files={files}
                    selectedFileType={selectedFileType}
                    caption={caption}
                    hashTag={hashTag}
                    destinationUrl={destinationUrl}
                    pinTitle={pinTitle}
                />
            }
        </>
    )
}

export default CommonFeedPreview;