import React from 'react'
import Logo from '@/_assets/svgs/logo/Safar Wanderlust (1).png'
import Image from "next/image"; 
import { useRouter } from 'next/navigation'

function CustomLogo({ logoOnly, className = '', imageStyle = '' }) {
  const router = useRouter()

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={{ cursor: 'pointer', width: 'max-content' }}
    >
      <Image
        onClick={() => router.push("/")}
        className={`h-[64px] w-[48px] cursor-pointer ${imageStyle}`}
        src={Logo}
        alt="Safar Wanderlust"
        width={48}
        height={64}
        priority
      />

      <div className="leading-tight">
        <p
          className="font-nunitobold700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] text-black"
          style={{ letterSpacing: '0.01rem', marginBottom: '2px' }}
        >
          Safar Wanderlust
        </p>
        <p
          className="text-[10px] sm:text-[11px] md:text-[11px] lg:text-[11px] text-black font-nunitoregular400"
          style={{ letterSpacing: '0.5px', marginTop: 0 }}
        >
          GROUP TRAVEL COMPANY
        </p>
      </div>
    </div>
  )
}

export default CustomLogo
