"use client";

import React from 'react'

// Import your SVGs here
import  MSMESvg from '../../../../_assets/svgs/user/msme_icon.svg'
import YourStorySvg from '../../../../_assets/svgs/user/yourstory_icon.svg'
import IndiaSvg from '../../../../_assets/svgs/user/mnp_icon.svg'
import GoogleSvg from '../../../../_assets/svgs/user/google_icon.svg'
import StartupSvg from '../../../../_assets/svgs/user/startup_icon.svg'

import Image from 'next/image';

const AwardFooter = () => {
  return (
    <footer className=" px-20 md:block hidden">
      <div className="text-center md:text-2xl text-base  text-white mt-[10vh] mb-2">
        Certifications That Define Our Credibility
      </div>
      <div className="flex gap-4 flex-wrap justify-around items-center ">
        <div className=" flex items-center justify-center">
          <Image
            src='/assets/svgs/user/msme_icon.svg'
            alt="MSME Logo"
            width={1000}
            height={1000}
            className="md:w-[10rem]  md:h-28 w-[6rem] object-cover"
          />
        </div>

        <div className="  md:h-28 flex items-center justify-center">
          <Image
            src='/assets/svgs/user/yourstory_icon.svg'
            alt="YourStory Logo"
            width={1000}
            height={1000}
            className="md:w-40 md:h-32 w-[5rem] object-cover "
          />
        </div>
        <div className=" flex items-center justify-center">
          <Image
            src='/assets/svgs/user/mnp_icon.svg'
            alt="Incredible India Logo"
            width={1000}
            height={1000}
            className="md:w-40 md:h-32 w-[6rem] object-cover "
          />
        </div>
        <div className=" flex items-center justify-center pt-6">
          <Image
            src='/assets/svgs/user/google_icon.svg'
            alt="Google"
            width={1000}
            height={1000}
            className="md:w-40 md:h-32 w-[5rem] object-fill "
          />
        </div>
        <div className="md:w-[10rem]  md:h-28  flex items-center justify-center">
          <div>
            <Image
              src='/assets/svgs/user/startup_icon.svg'
              alt="Startup India Logo"
              width={1000}
              height={1000}
              className="md:w-[10rem]  md:h-28   object-fill "
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AwardFooter
