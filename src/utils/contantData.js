export const UpdateCommentFailedMsg = "Update Failed: Users can only edit comments created with Addy."
export const SomethingWentWrong = "An error occurred!"
export const SomethingWentWrongTryLater = "An error occurred. Please try again later."
export const NoBusinessAccountFound = "No business account found for {0} to connect!"
export const CouldNotPostComment = "Unable to post the comment!"
export const UpdatedSuccessfully = "{0} has been updated successfully."
export const DeletedSuccessfully = "{0} has been deleted successfully."
export const PostAlreadyDeleted = "It seems the post has been removed."
export const ErrorFetchingPost = "An error occurred while fetching the post!"
export const SelectAtleastOnePage = "Please select at least one page."
export const SelectAtLeastOnePageForDraft = "Please select at least one page to save the post as a draft."
export const IsRequired = "{0} is required."
export const MediaRequiredForPost = "To create a post, please upload an image or video. Add a media file to continue."
export const IsRequiredFor = "{0} is required for {1}."
export const OnlyImageOrVideoCanBePosted = "Images and videos cannot be posted together!"
export const MultiMediaLimit = "You cannot post more than {0} {1}!"
export const MultiMediaSizeLimit = "{0} larger than {1} {2} cannot be uploaded for {3}."
export const InvalidAspectRatio = "The image's aspect ratio must be between 4:5 and 1.91:1 for Instagram."
export const InvalidImageDimension = "Please upload an image smaller than 6,012 × 6,012 px for LinkedIn."
export const VideoFormatNotSupported = "Only {0} video formats are supported for {1}."
export const PinterestImageLimitation = "Only a single image can be posted on Pinterest."
export const DisconnectAccountWarning = "Are you sure you want to disconnect? This will remove all draft and scheduled posts for {0}. Do you wish to proceed?"
export const DisconnectPageWarning = "Disconnecting this page will remove all draft and scheduled posts. Are you sure you want to continue?"
export const NotConnected = "No {0} connected yet. Link your {1} to see activity on your {0}!"
export const NoPostInDraft=" This page is waiting for you! Start adding Posts <br /> to see the magic."
export const EmptyInsightGridMessage = "Insights will appear here once you start using the platform. Let’s begin!"
export const EmptyNotificationGridMessage = "All clear! No new notifications at the moment."
export const EnterMessageToStartChat = "Please type a message to start a chat with Addy."
export const MessageAttachmentSizeError = "Files larger than 25 MB cannot be uploaded!"
export const ChatOpenMessage = "Hi, I’m Addy, your service assistant. How can I assist you today?"
export const DeletePostConfirmationMessage = "Are you sure you want to delete this post?"
export const DeletePostFromPageConfirmationMessage = "Are you sure you want to remove this post from {0}?"
export const PageRemovedFromPostSuccessfully = "The post has been successfully removed."


export const unProtectedUrls=["/login","/","/sign-up","/reset-password","/forgot-password","/auth-redirect","/password/success"]

export const enabledSocialMedia = {
    isFacebookEnabled: `${import.meta.env.VITE_APP_ENABLE_FACEBOOK}` === "true",
    isInstagramEnabled: `${import.meta.env.VITE_APP_ENABLE_INSTAGRAM}` === "true",
    isLinkedinEnabled: `${import.meta.env.VITE_APP_ENABLE_LINKEDIN}` === "true",
    isPinterestEnabled: `${import.meta.env.VITE_APP_ENABLE_PINTEREST}` === "true",
}

export const SocialAccountProvider = Object.freeze({
    ...(enabledSocialMedia.isFacebookEnabled && {FACEBOOK: "facebook"}),
    ...(enabledSocialMedia.isInstagramEnabled && {INSTAGRAM: "instagram"}),
    ...(enabledSocialMedia.isLinkedinEnabled && {LINKEDIN: "linkedin"}),
    ...(enabledSocialMedia.isPinterestEnabled && {PINTEREST: "pinterest"}),
});

export const SignupSource = Object.freeze({
    FACEBOOK: "FACEBOOK",
    GOOGLE: "GOOGLE",
    ADDY: "ADDY",
});

export const Events = Object.freeze({
    NOTIFICATION_EVENT: "NOTIFICATION",
    UNSEEN_NOTIFICATIONS_COUNT_EVENT: "UNSEEN_NOTIFICATIONS_COUNT",
});

export const Linkedin_URN_Id_Types = Object.freeze({
    ORGANIZATION: "organization",
    DIGITAL_MEDIA_ASSET: "digitalmediaAsset",
    PERSON: "person",
    SHARE: "share",
    UGC_POST: "ugcPost",
    IMAGE: "image",
    VIDEO: "video",
});

export const Industries = Object.freeze({
    ACCOUNTING: 'Accounting',
    AIRLINES_AVIATION: 'Airlines/Aviation',
    ANIMATION: 'Animation',
    APPAREL_FASHION: 'Apparel/Fashion',
    ARCHITECTURE_PLANNING: 'Architecture/Planning',
    ARTS_CRAFTS: 'Arts/Crafts',
    AUTOMOTIVE: 'Automotive',
    AVIATION_AEROSPACE: 'Aviation/Aerospace',
    BANKING_MORTGAGE: 'Banking/Mortgage',
    BIOTECHNOLOGY_GREENTECH: 'Biotechnology/Greentech',
    BROADCAST_MEDIA: 'Broadcast Media',
    BUILDING_MATERIALS: 'Building Materials',
    BUSINESS_SUPPLIES_EQUIPMENT: 'Business Supplies/Equipment',
    CHEMICALS: 'Chemicals',
    CIVIC_SOCIAL_ORGANIZATION: 'Civic/Social Organization',
    CIVIL_ENGINEERING: 'Civil Engineering',
    COMMERCIAL_REAL_ESTATE: 'Commercial Real Estate',
    COMPUTER_GAMES: 'Computer Games',
    COMPUTER_HARDWARE: 'Computer Hardware',
    COMPUTER_NETWORKING: 'Computer Networking',
    COMPUTER_SOFTWARE_ENGINEERING: 'Computer Software/Engineering',
    COMPUTER_NETWORK_SECURITY: 'Computer Network Security',
    CONSTRUCTION: 'Construction',
    CONSUMER_ELECTRONICS: 'Consumer Electronics',
    CONSUMER_GOODS: 'Consumer Goods',
    CONSUMER_SERVICES: 'Consumer Services',
    COSMETICS: 'Cosmetics',
    DAIRY: 'Dairy',
    DEFENSE_SPACE: 'Defense/Space',
    DESIGN: 'Design',
    E_LEARNING: 'E-Learning',
    EDUCATION_MANAGEMENT: 'Education Management',
    ELECTRICAL_ELECTRONIC_MANUFACTURING: 'Electrical/Electronic Manufacturing',
    ENTERTAINMENT_MOVIE_PRODUCTION: 'Entertainment/Movie Production',
    ENVIRONMENTAL_SERVICES: 'Environmental Services',
    EVENTS_SERVICES: 'Events Services',
    EXECUTIVE_OFFICE: 'Executive Office',
    FACILITIES_SERVICES: 'Facilities Services',
    FARMING: 'Farming',
    FINANCIAL_SERVICES: 'Financial Services',
    FINE_ART: 'Fine Art',
    FISHERY: 'Fishery',
    FOOD_PRODUCTION: 'Food Production',
    FOOD_BEVERAGES: 'Food/Beverages',
    FUNDRAISING: 'Fundraising',
    FURNITURE: 'Furniture',
    GAMBLING_CASINOS: 'Gambling/Casinos',
    GLASS_CERAMICS_CONCRETE: 'Glass/Ceramics/Concrete',
    GOVERNMENT_ADMINISTRATION: 'Government Administration',
    GOVERNMENT_RELATIONS: 'Government Relations',
    GRAPHIC_DESIGN_WEB_DESIGN: 'Graphic Design/Web Design',
    HEALTH_FITNESS: 'Health/Fitness',
    HIGHER_EDUCATION_ACADEMIA: 'Higher Education/Academia',
    HOSPITAL_HEALTH_CARE: 'Hospital/Health Care',
    HOSPITALITY: 'Hospitality',
    HUMAN_RESOURCES_HR: 'Human Resources/HR',
    IMPORT_EXPORT: 'Import/Export',
    INDIVIDUAL_FAMILY_SERVICES: 'Individual/Family Services',
    INDUSTRIAL_AUTOMATION: 'Industrial Automation',
    INFORMATION_SERVICES: 'Information Services',
    INFORMATION_TECHNOLOGY_IT: 'Information Technology/IT',
    INSURANCE: 'Insurance',
    INTERNATIONAL_AFFAIRS: 'International Affairs',
    INTERNATIONAL_TRADE_DEVELOPMENT: 'International Trade/Development',
    INTERNET: 'Internet',
    INVESTMENT_BANKING_VENTURE: 'Investment Banking/Venture',
    JUDICIARY: 'Judiciary',
    LAW_ENFORCEMENT: 'Law Enforcement',
    LAW_PRACTICE_LAW_FIRMS: 'Law Practice/Law Firms',
    LEGAL_SERVICES: 'Legal Services',
    LEGISLATIVE_OFFICE: 'Legislative Office',
    LIBRARY: 'Library',
    LOGISTICS_PROCUREMENT: 'Logistics/Procurement',
    LUXURY_FOODS_JEWELRY: 'Luxury Foods/Jewelry',
    MACHINERY: 'Machinery',
    MANAGEMENT_CONSULTING: 'Management Consulting',
    MARKET_RESEARCH: 'Market Research',
    MARKETING_ADVERTISING_SALES: 'Marketing/Advertising/Sales',
    MECHANICAL_INDUSTRIAL_ENGINEERING: 'Mechanical/Industrial Engineering',
    MEDIA_PRODUCTION: 'Media Production',
    MEDICAL_EQUIPMENT: 'Medical Equipment',
    MEDICAL_PRACTICE: 'Medical Practice',
    MENTAL_HEALTH_CARE: 'Mental Health Care',
    MILITARY_INDUSTRY: 'Military Industry',
    MINING_METALS: 'Mining/Metals',
    MUSEUMS_INSTITUTIONS: 'Museums/Institutions',
    MUSIC: 'Music',
    NANOTECHNOLOGY: 'Nanotechnology',
    NEWSPAPERS_JOURNALISM: 'Newspapers/Journalism',
    NON_PROFIT_VOLUNTEERING: 'Non-Profit/Volunteering',
    OIL_ENERGY_SOLAR_GREENTECH: 'Oil/Energy/Solar/Greentech',
    ONLINE_PUBLISHING: 'Online Publishing',
    OUTSOURCING_OFFSHORING: 'Outsourcing/Offshoring',
    PACKAGE_FREIGHT_DELIVERY: 'Package/Freight Delivery',
    PACKAGING_CONTAINERS: 'Packaging/Containers',
    PAPER_FOREST_PRODUCTS: 'Paper/Forest Products',
    PERFORMING_ARTS: 'Performing Arts',
    PHARMACEUTICALS: 'Pharmaceuticals',
    PHILANTHROPY: 'Philanthropy',
    PHOTOGRAPHY: 'Photography',
    PLASTICS: 'Plastics',
    POLITICAL_ORGANIZATION: 'Political Organization',
    PRIMARY_SECONDARY_EDUCATION: 'Primary/Secondary Education',
    PRINTING: 'Printing',
    PROFESSIONAL_TRAINING: 'Professional Training',
    PROGRAM_DEVELOPMENT: 'Program Development',
    PUBLIC_SAFETY: 'Public Safety',
    PUBLISHING_INDUSTRY: 'Publishing Industry',
    REAL_ESTATE_MORTGAGE: 'Real Estate/Mortgage',
    RELIGIOUS_INSTITUTIONS: 'Religious Institutions',
    RESEARCH_INDUSTRY: 'Research Industry',
    RESTAURANTS: 'Restaurants',
    RETAIL_INDUSTRY: 'Retail Industry',
    SEMICONDUCTORS: 'Semiconductors',
    SHIPBUILDING: 'Shipbuilding',
    SPORTING_GOODS: 'Sporting Goods',
    SPORTS: 'Sports',
    STAFFING_RECRUITING: 'Staffing/Recruiting',
    SUPERMARKETS: 'Supermarkets',
    TELECOMMUNICATIONS: 'Telecommunications',
    TEXTILES: 'Textiles',
    TRANSLATION_LOCALIZATION: 'Translation/Localization',
    TRANSPORTATION: 'Transportation',
    UTILITIES: 'Utilities',
    VENTURE_CAPITAL_VC: 'Venture Capital/VC',
    VETERINARY: 'Veterinary',
    WAREHOUSING: 'Warehousing',
    WHOLESALE: 'Wholesale',
    WRITING_EDITING: 'Writing/Editing',
    OTHER: 'Other',
});

export const selectGraphDaysOptions= [{days:7,label:'last 7 days'},{days:15,label:'last 15 days'},{days:30,label:'last 30 days'}];

export const  commonConnectSocialAccountButtonStyle = {
    borderRadius: "5px",
    background: "#F07C33",
    boxShadow: "unset",
    fontSize: "12px",
    color: "#fff",
    border: "1px solid #F07C33",
    height: "39px",
    minWidth: "111px",
    margin: "10px",
    width: "11px",
};
