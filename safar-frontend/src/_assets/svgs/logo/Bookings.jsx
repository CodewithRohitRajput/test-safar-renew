export default function Bookings({ color }) {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 22 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.6667 4.02714H2.33333C1.59695 4.02714 1 4.62409 1 5.36047V20.0271C1 20.7635 1.59695 21.3605 2.33333 21.3605H19.6667C20.403 21.3605 21 20.7635 21 20.0271V5.36047C21 4.62409 20.403 4.02714 19.6667 4.02714Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 9.36047H21"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.33301 6.02714V1.36047"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.667 6.02714V1.36047"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
