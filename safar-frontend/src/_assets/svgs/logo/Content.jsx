import React from 'react'

function Content({ color = '#3F3F44' }) {
  return (
    <div>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.6667 1.00012H2.33333C1.59695 1.00012 1 1.59708 1 2.33346V19.6668C1 20.4032 1.59695 21.0001 2.33333 21.0001H19.6667C20.403 21.0001 21 20.4032 21 19.6668V2.33346C21 1.59708 20.403 1.00012 19.6667 1.00012Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.8888 14.3336H16.9999"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.00037 14.3336H7.44481"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.8889 14.3334C11.8889 14.7729 11.7586 15.2025 11.5144 15.568C11.2702 15.9334 10.9231 16.2182 10.5171 16.3864C10.111 16.5546 9.66422 16.5986 9.23315 16.5129C8.80208 16.4271 8.40612 16.2155 8.09533 15.9047C7.78455 15.5939 7.5729 15.198 7.48716 14.7669C7.40141 14.3358 7.44542 13.889 7.61362 13.483C7.78181 13.0769 8.06664 12.7298 8.43208 12.4857C8.79752 12.2415 9.22717 12.1111 9.66668 12.1111C10.2561 12.1111 10.8213 12.3453 11.238 12.762C11.6548 13.1788 11.8889 13.744 11.8889 14.3334V14.3334Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.7781 7.66669H5.00037"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.2218 7.6668C17.2218 7.22729 17.0915 6.79765 16.8473 6.4322C16.6031 6.06676 16.256 5.78193 15.85 5.61374C15.4439 5.44554 14.9971 5.40154 14.566 5.48728C14.135 5.57303 13.739 5.78467 13.4282 6.09546C13.1174 6.40624 12.9058 6.8022 12.82 7.23327C12.7343 7.66434 12.7783 8.11115 12.9465 8.51721C13.1147 8.92327 13.3995 9.27033 13.765 9.51451C14.1304 9.7587 14.5601 9.88903 14.9996 9.88903C15.5889 9.88903 16.1542 9.6549 16.5709 9.23815C16.9877 8.8214 17.2218 8.25617 17.2218 7.6668Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default Content
