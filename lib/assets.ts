/**
 * Imagery is served from local /public assets where available and otherwise
 * falls back to the existing Amaya Vercel deployments.
 */
const CURRENT = "https://amaya-senior-living.vercel.app";
const LAYAN = "https://amaya-layan.vercel.app";

export const ASSETS = {
  heroVideo: `/video/Trees_swaying_in_breeze_202606061630-ezremove.mp4`,
  heroImage: `${CURRENT}/images/HeroImage.webp`,
  locationDesktop: "/location/location_desktop_965×1060.webp",
  locationMobile: "/location/location_mobile_690×515.webp",
  bedroom: `${CURRENT}/images/bedroom692x400.webp`,
  founders: `${CURRENT}/images/CommunitySpaceFounders.webp`,
  foundersDesktop: "/founders/founders-Desktop-1760-1173px.webp",
  foundersMobile: "/founders/founders-Mobile-780-520px.webp",
  architectureDesktop: "/architecture/Architecture_desktop_2224×953.webp",
  architectureMobile: "/architecture/Architecture_phone684×513.webp",
  cardsRoomDesktop: "/cardsRoom/Cards_desktop_1280×800.webp",
  cardsRoomMobile: "/cardsRoom/card_room_mobile_690×430.webp",
  courtyardDesktop: "/courtyard/courtyard_Desktop_970×1110.webp",
  courtyardMobile: "/courtyard/Courtyard_mobile_690×515.webp",
  yoga :"/Infrastructure/AmenitiesSlides512×340_1.webp",
  infrastructure1: "/Infrastructure/Infrastructure512×340_1.webp",
  infrastructure2: "/Infrastructure/Infrastructure512×340_2.webp",
  infrastructure3: "/Infrastructure/Infrastructure512×340_3.webp",
  infrastructure4: "/Infrastructure/AmenitiesSlides512×340_2.webp",
  residence1Desktop: "/Residences/Residence-Desktop-1000-625-01.webp",
  residence1Mobile: "/Residences/Residence-Mobile-690×430-01.webp",
  residence2Desktop: "/Residences/Residence-Desktop-1000-625-02.webp",
  residence2Mobile: "/Residences/Residence-Mobile-690×430-02.webp",
  residence3Desktop: "/Residences/Residence-Desktop-1000-625-03.webp",
  residence3Mobile: "/Residences/Residence-Mobile-690×430-03.webp",
  residence4Desktop: "/Residences/Residence-Desktop-1000-625-04.webp",
  residence4Mobile: "/Residences/Residence-Mobile-690×430-04.webp",
  residence5Desktop: "/Residences/Residence-Desktop-1000-625-05.webp",
  residence5Mobile: "/Residences/Residence-Mobile-690×430-05.webp",
  galleryHeroFacade: "/gallery/01_home_hero_facade_wide.avif",
  galleryLocationAerial: "/gallery/02_location_forest_context_aerial.avif",
  galleryArrivalDriveway: "/gallery/03_arrival_entrance_driveway.avif",
  galleryCentralCourtyard: "/gallery/04_why_amaya_central_garden_courtyard.avif",
  galleryPoolCanopy: "/gallery/05_amenities_pool_courtyard_canopy.avif",
  galleryWaterFeature: "/gallery/06_amenities_reflective_water_body_close.avif",
  galleryPoolReflection: "/gallery/07_amenities_pool_reflection_alt.avif",
  galleryAmphitheatre: "/gallery/08_community_amphitheatre_stepped_garden.avif",
  galleryWellnessGrove: "/gallery/09_wellness_quiet_seating_grove.avif",
  galleryColonnade: "/gallery/10_architecture_colonnade_detail.avif",
  galleryOverviewAerial: "/gallery/11_site_overview_courtyard_pool_aerial.avif",
  galleryBetweenBlocks: "/gallery/12_landscape_between_blocks_wide.avif",
  map: `${LAYAN}/images/Website_Map_Small.png`,
  experienceDesktop: "/experience-Amaya/See_it_Desktop_2880×1840.webp",
  experienceMobile: "/experience-Amaya/See_it_Mobile_Banner_780×1450.webp",
  founderTanayDesktop: "/founders/Tanay-saboo-founder-vera-vita-desktop.webp",
  founderTanayMobile: "/founders/Tanay-saboo-founder-vera-vita-mobile.webp",
  founderDhruvDesktop: "/founders/dhruv_desktop_1200x1500px.webp",
  founderDhruvMobile: "/founders/dhruv_mobile_800x600px.webp",
  founderArudradevDesktop: "/founders/Arudradev_desktop_1200x1500px.webp",
  founderArudradevMobile: "/founders/Arudradev_mobile_800x600px.webp",
};

export const PHONE = "+91 95533 95533";
export const PHONE_HREF = "tel:+919553395533";
