export const UpdateCommentFailedMsg = "Update Fail: User can only edit comments made from Addy."
export const SomethingWentWrong = "Something went wrong!"
export const SomethingWentWrongTryLater = "Something went wrong, Please try again later!"
export const NoBusinessAccountFound = "No business account found for {0} to connect!"
export const CouldNotPostComment = "Could not post comment!"
export const UpdatedSuccessfully = "{0} updated successfully"
export const PostAlreadyDeleted = "Looks like the post has been taken down"
export const ErrorFetchingPost = "Something went wrong while fetching the post !"
export const SelectAtleastOnePage = "Please Select at least one page!"
export const IsRequired = "{0} is required !"
export const IsRequiredFor = "{0} is required for {1} !"
export const OnlyImageOrVideoCanBePosted = "Image and Video cannot be posted together !"
export const MultiMediaLimit = "More than {0} {1} cannot be posted !"
export const MultiMediaSizeLimit = "{0} than {1} {2} cannot be uploaded for {3} !"
export const InvalidAspectRatio = "Image aspect ratio must be within a 4:5 to 1.91:1 range for instagram  !"
export const InvalidImageDimension = "Please upload an image smaller than 6,012 × 6,012 px. for linkedin  !"
export const VideoFormatNotSupported = "Only {0} video format is supported for {1}  !"
export const PinterestImageLimitation = "Only single image can be posted on pinterest !"
export const DisconnectAccountWarning = "Are you sure you want to disconnect? Doing so will remove all draft or scheduled posts for {0}. Are you still certain you want to disconnect?"
export const DisconnectPageWarning = "Doing so will remove all draft or scheduled posts for this page. Are you still certain you want to disconnect?"
export const NotConnected=" No {0} here yet. Connect your {1} to see what’s happening on your {0}!"
export const NoPostInDraft=" This page is waiting for you! Start adding Posts to see the magic."
export const EmptyInsightGridMessage="Insights will appear here once you start using the platform. Let’s get started!"
export const EmptyNotificationGridMessage="No items here yet. Let’s get started and make this list lively!"

export const unProtectedUrls=["/login","/","/sign-up","/reset-password","/forgot-password","/auth-redirect"]

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
