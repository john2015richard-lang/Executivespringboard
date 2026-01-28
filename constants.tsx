
import { WebinarData } from './types';

export const INITIAL_WEBINARS: WebinarData[] = [
  {
    id: '1',
    topLabel: "LIVE EXECUTIVE STRATEGY SESSION",
    title: "COMMUNICATION THAT <span style='color: #007bff'>BUILDS TRUST</span>: LEVERAGING THE UNWRITTEN PROTOCOLS",
    titleFontSize: 72,
    subtitle: "Join us for 60 minutes to master the protocols of elite leadership: how to manage silence, navigate 'around the back' power dynamics, and build unshakeable trust",
    subtitleFontSize: 20,
    date: "THURSDAY, FEBRUARY 6, 2026",
    timeRange: "1:00 PM EST (12:00 PM CST)",
    duration: "60 Minutes",
    formatType: "Executive Workshop",
    registrations: 482,
    ctaText: "SIGN UP NOW",
    ctaLink: "",
    ctaFontSize: 20,
    zoomLink: "https://zoom.us/j/meeting-id",
    formFields: [
      { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Cooper', required: true },
      { id: 'title', label: 'Job Title', type: 'text', placeholder: 'Chief Operating Officer', required: true },
      { id: 'email', label: 'Business Email', type: 'email', placeholder: 'jane@company.com', required: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', required: true }
    ],
    speakers: [
      {
        name: "STEVE MOSS",
        title: "President @ Executive Springboard",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
        label: "YOUR HOST",
        badgeBg: "#f39c12",
        badgeColor: "#ffffff",
        bio: "Former VP Marketing, Gilbey Canada Inc; Pillsbury. Former VP Strategy & Brand Dev, Heublein Intl; Pillsbury, Former CMO, Pillsbury Intl; Ice Cream Partners/Nestle Ice Cream; Imation. President, Executive Springboard, LLC."
      },
      {
        name: "LUIS MORENO",
        title: "Executive Advisor @ Peak Global",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
        label: "SPECIAL GUEST",
        badgeBg: "#f39c12",
        badgeColor: "#ffffff",
        bio: "Former VP Marketing, Synchrony. Co-founder and Board Member, Twin Cities Business Peer Network, Advisory Board Member, Argosy University. Marketing Leader, NewPublica. Adjunct Professor, Leadership & Management, University of Minnesota."
      }
    ],
    logoImage: "https://plaxonic.com/wp-content/uploads/2023/12/logo.png",
    logoHeight: 56,
    themeColor: "#007bff",
    isActive: true,
    attendees: []
  }
];
