import { motion } from "framer-motion";
import {
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
    FaFacebookF,
    FaYoutube,
    FaTiktok,
    FaRedditAlien,
    FaPinterestP,
} from "react-icons/fa";
import { Heart, MessageCircle, Share2, Bell } from "lucide-react";

const FLOATING_ICONS = [
    { Icon: FaInstagram, top: "12%", left: "6%", size: 30, color: "#f472b6", dur: 9, delay: 0 },
    { Icon: FaTwitter, top: "22%", left: "86%", size: 26, color: "#e2e8f0", dur: 11, delay: 1.2 },
    { Icon: FaLinkedinIn, top: "64%", left: "8%", size: 28, color: "#38bdf8", dur: 10, delay: 0.6 },
    { Icon: FaFacebookF, top: "78%", left: "82%", size: 30, color: "#60a5fa", dur: 12, delay: 2 },
    { Icon: FaYoutube, top: "40%", left: "92%", size: 30, color: "#f87171", dur: 8.5, delay: 0.3 },
    { Icon: FaTiktok, top: "84%", left: "30%", size: 24, color: "#22d3ee", dur: 9.5, delay: 1.6 },
    { Icon: FaRedditAlien, top: "30%", left: "16%", size: 24, color: "#fb923c", dur: 10.5, delay: 0.9 },
    { Icon: FaPinterestP, top: "70%", left: "56%", size: 22, color: "#f87171", dur: 11.5, delay: 2.4 },
    { Icon: Heart, top: "18%", left: "44%", size: 20, color: "#fb7185", dur: 8, delay: 0.4 },
    { Icon: MessageCircle, top: "52%", left: "94%", size: 18, color: "#a78bfa", dur: 9, delay: 1.9 },
    { Icon: Share2, top: "88%", left: "66%", size: 20, color: "#34d399", dur: 10, delay: 0.7 },
    { Icon: Bell, top: "46%", left: "4%", size: 18, color: "#fbbf24", dur: 12, delay: 1.1 },
];

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
            {/* Aurora blobs */}
            <motion.div
                className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-indigo-600/25 blur-[110px]"
                animate={{ x: [0, 90, -30, 0], y: [0, 50, 110, 0] }}
                transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/3 -right-48 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[110px]"
                animate={{ x: [0, -80, 20, 0], y: [0, 80, -40, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-48 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-[110px]"
                animate={{ x: [0, 60, -60, 0], y: [0, -60, 20, 0] }}
                transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-16 left-1/2 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]"
                animate={{ x: [0, -120, 40, 0], y: [0, 40, -30, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.16]
                    [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
                    [background-size:56px_56px]
                    [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
            />

            {/* Floating social icons */}
            {FLOATING_ICONS.map(({ Icon, top, left, size, color, dur, delay }, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ top, left }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.5, 0.5, 0],
                        y: [0, -26, -52, -78],
                        rotate: [0, 8, -8, 0],
                    }}
                    transition={{
                        duration: dur,
                        delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md">
                        <Icon size={size} color={color} style={{ opacity: 0.9 }} />
                    </div>
                </motion.div>
            ))}

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,6,15,0.85)_100%)]" />
        </div>
    );
}
