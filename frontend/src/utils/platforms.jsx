import {
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
    FaFacebookF,
    FaYoutube,
    FaTiktok,
} from "react-icons/fa";

export const PLATFORM_META = {
    instagram: {
        icon: FaInstagram,
        label: "Instagram",
        text: "text-pink-400",
        gradient: "from-fuchsia-500 via-pink-500 to-amber-400",
    },
    linkedin: {
        icon: FaLinkedinIn,
        label: "LinkedIn",
        text: "text-sky-400",
        gradient: "from-sky-500 to-blue-600",
    },
    twitter: {
        icon: FaTwitter,
        label: "Twitter / X",
        text: "text-slate-200",
        gradient: "from-slate-500 to-slate-800",
    },
    facebook: {
        icon: FaFacebookF,
        label: "Facebook",
        text: "text-blue-400",
        gradient: "from-blue-500 to-indigo-600",
    },
    youtube: {
        icon: FaYoutube,
        label: "YouTube",
        text: "text-red-400",
        gradient: "from-red-500 to-rose-600",
    },
    tiktok: {
        icon: FaTiktok,
        label: "TikTok",
        text: "text-cyan-300",
        gradient: "from-cyan-400 to-fuchsia-500",
    },
};

export const getPlatformMeta = (platform) =>
    PLATFORM_META[platform?.toLowerCase()] || {
        icon: FaTwitter,
        label: platform || "Platform",
        text: "text-violet-300",
        gradient: "from-violet-500 to-indigo-600",
    };
