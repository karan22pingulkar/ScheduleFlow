export default function Logo({ size = 36, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="sf-logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6366f1" />
                    <stop offset="0.55" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#sf-logo-grad)" />
            {/* source box */}
            <rect x="10" y="21" width="20" height="22" rx="5.5" fill="#fff" />
            {/* fanning arrows */}
            <g
                stroke="#fff"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            >
                {/* middle */}
                <path d="M32 32 H51" />
                <path d="M45 26.5 L51 32 L45 37.5" />
                {/* top */}
                <path d="M31 29.5 C39 27.5 41 17.5 47 15.5" />
                <path d="M41 14 L48 14.5 L47.5 21.5" />
                {/* bottom */}
                <path d="M31 34.5 C39 36.5 41 46.5 47 48.5" />
                <path d="M41 50 L48 49.5 L47.5 42.5" />
            </g>
        </svg>
    );
}
