import React from "react";

/**
 * Authentic vector payment card & gateway badges
 * Visa, Mastercard, Verve, Paystack
 */

export function VisaBadge({ className = "h-6 w-auto" }) {
  return (
    <svg
      viewBox="0 0 44 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Visa"
    >
      <rect
        width="44"
        height="28"
        rx="5"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      {/* VISA wordmark */}
      <g transform="translate(7.5, 9)">
        <path
          d="M11.9 10.3H9.7L11.1 1.7H13.3L11.9 10.3Z"
          fill="#1A1F71"
        />
        <path
          d="M18.7 1.9C18.2 1.7 17.5 1.5 16.6 1.5C14.4 1.5 12.8 2.6 12.8 4.3C12.8 5.6 13.9 6.3 14.8 6.7C15.7 7.1 16 7.4 16 7.8C16 8.4 15.2 8.8 14.5 8.8C13.6 8.8 13.1 8.6 12.4 8.3L12 8.1L11.6 10.1C12.2 10.4 13.2 10.6 14.3 10.6C16.7 10.6 18.3 9.4 18.3 7.6C18.3 6.1 17.3 5.3 16.2 4.8C15.4 4.4 14.9 4.1 14.9 3.7C14.9 3.2 15.5 2.8 16.3 2.8C17 2.8 17.6 3 18.1 3.2L18.3 3.3L18.7 1.9Z"
          fill="#1A1F71"
        />
        <path
          d="M23.9 1.7H22.2C21.7 1.7 21.2 1.9 21 2.4L17.5 10.3H19.8L20.2 9.1H22.9L23.2 10.3H25.2L23.9 1.7ZM20.8 7.4L22 4.2L22.6 7.4H20.8Z"
          fill="#1A1F71"
        />
        <path
          d="M8.8 1.7L6.7 7.6L6.4 6.3C6 4.8 4.6 3.2 3.3 2.5L5.2 10.3H7.6L11.2 1.7H8.8Z"
          fill="#1A1F71"
        />
        <path
          d="M4.9 2.5C3.8 2.9 2.8 3.5 2 4.3L2.2 3.6C2.5 2.6 3.3 1.8 4.2 1.7H7.4L4.9 10.3L4.9 2.5Z"
          fill="#F7B600"
        />
      </g>
    </svg>
  );
}

export function MastercardBadge({ className = "h-6 w-auto" }) {
  return (
    <svg
      viewBox="0 0 44 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mastercard"
    >
      <rect
        width="44"
        height="28"
        rx="5"
        fill="#141414"
        stroke="#2C2C2C"
        strokeWidth="1"
      />
      {/* Overlapping Circles */}
      <circle cx="17.5" cy="14" r="7.5" fill="#EB001B" />
      <circle cx="26.5" cy="14" r="7.5" fill="#F79E1B" fillOpacity="0.92" />
      <path
        d="M22 8C23.9 9.5 25.1 11.6 25.1 14C25.1 16.4 23.9 18.5 22 20C20.1 18.5 18.9 16.4 18.9 14C18.9 11.6 20.1 9.5 22 8Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function VerveBadge({ className = "h-6 w-auto" }) {
  return (
    <svg
      viewBox="0 0 44 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Verve"
    >
      <rect
        width="44"
        height="28"
        rx="5"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      {/* Verve Logo Mark */}
      <g transform="translate(6, 6)">
        {/* Ribbon symbol */}
        <path
          d="M2.5 1.5L6.5 13.5H9.5L13.5 1.5H10.8L8 9.5L5.2 1.5H2.5Z"
          fill="#ED1C24"
        />
        <circle cx="8" cy="4.5" r="2.2" fill="#0075B0" />
        {/* Verve text */}
        <text
          x="14"
          y="11.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="9"
          fontStyle="italic"
          letterSpacing="-0.3px"
          fill="#1C1C1C"
        >
          verve
        </text>
      </g>
    </svg>
  );
}

export function PaystackBadge({ className = "h-6 w-auto" }) {
  return (
    <svg
      viewBox="0 0 44 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Paystack"
    >
      <rect
        width="44"
        height="28"
        rx="5"
        fill="#081726"
        stroke="#162D4A"
        strokeWidth="1"
      />
      {/* Paystack 4 Bars */}
      <g transform="translate(10, 7.5)">
        <rect x="0" y="0" width="24" height="2.3" rx="1.15" fill="#00C3F7" />
        <rect x="0" y="3.7" width="16" height="2.3" rx="1.15" fill="#00C3F7" />
        <rect x="0" y="7.4" width="24" height="2.3" rx="1.15" fill="#00C3F7" />
        <rect x="0" y="11.1" width="12" height="2.3" rx="1.15" fill="#00C3F7" />
      </g>
    </svg>
  );
}

export default function PaymentBadges({ className = "flex items-center gap-2", badgeClassName = "h-6 w-auto" }) {
  return (
    <div className={className}>
      <VisaBadge className={badgeClassName} />
      <MastercardBadge className={badgeClassName} />
      <VerveBadge className={badgeClassName} />
      <PaystackBadge className={badgeClassName} />
    </div>
  );
}
