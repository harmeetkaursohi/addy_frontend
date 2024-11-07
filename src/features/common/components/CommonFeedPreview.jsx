import React from "react";
import FacebookFeedPreview from "./FacebookFeedPreview";
import InstagramFeedPreview from "./InstagramFeedPreview";
import PinterestFeedPreview from "./PinterestFeedPreview";
import LinkedinFeedpreview from "./LinkedinFeedPreview";
import DefaultFeedPreview from "./DefaultFeedPreview";

const CommonFeedPreview = ({
                               reference,
                               socialMediaType,
                               pageImageUrl,
                               previewTitle,
                               pageName,
                               files,
                               selectedFileType,
                               caption,
                               hashTag,
                               destinationUrl = null,
                               pinTitle = null,
                           }) => {

    return (
        <>
            {
                socialMediaType === "FACEBOOK" &&
                <FacebookFeedPreview
                    reference={reference}
                    previewTitle={previewTitle}
                    pageName={pageName}
                    pageImage={pageImageUrl}
                    files={files}
                    selectedFileType={selectedFileType}
                    caption={caption}
                    hashTag={hashTag}
                />
            }

            {
                socialMediaType === "INSTAGRAM" &&
                <InstagramFeedPreview
                    reference={reference}
                    previewTitle={previewTitle}
                    pageName={pageName}
                    pageImage={pageImageUrl}
                    files={files}
                    selectedFileType={selectedFileType}
                    caption={caption}
                    hashTag={hashTag}
                />
            }

            {
                socialMediaType === "PINTEREST" &&
                <PinterestFeedPreview
                    reference={reference}
                    previewTitle={previewTitle}
                    pageName={pageName}
                    pageImage={pageImageUrl}
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
                    reference={reference}
                    previewTitle={previewTitle}
                    pageName={pageName}
                    pageImage={pageImageUrl}
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