"use client";

import React from "react";
import Image from "next/image";

import MapIcon from "../../../../_assets/svgs/user/MapIcon.svg";
import BackpackIcon from "../../../../_assets/svgs/user/backpack_icon.webp";
import TentIcon from "../../../../_assets/svgs/user/camping_tent_icon.webp";
import Icon1 from "../../../../_assets/svgs/user/personalized_itineraries.svg";
import Memories from "../../../../_assets/svgs/user/lasting_memory.svg";
import PerfectTrip from "../../../../_assets/svgs/user/perfect_trip.svg";
import SeamlessTravel from "../../../../_assets/svgs/user/seamless_travel.svg";
import LeftFoot from "../../../../_assets/svgs/user/Left_Foot.svg";
import RightFoot from "../../../../_assets/svgs/user/Right_Foot.svg";
import Icon2 from "../../../../_assets/svgs/user/seamless_experience.svg";
import Icon3 from "../../../../_assets/svgs/user/seamless_experience.svg";
import Icon4 from "../../../../_assets/svgs/user/unforgettable_memories.svg";

const JourneySection = () => {
  return (
    <div className="mb-6 mt-10">
      {/* Map background */}
      <div className="relative w-full h-[650px] md:h-[450px]">
        <div className="absolute inset-0">
          <MapIcon className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 text-center px-4 py-6">
          <h2 className="mx-auto font-titleMedium text-2xl md:text-5xl">
            Experiences that Last <span className="text-orange-500"> Beyond </span>the Trip
          </h2>

          <div className="mt-10 md:mx-20">
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:mb-20">
              <TextCard
                icon={<Memories />}
                title="Shared Moments, Amplified Joy"
                text={`Every adventure is better when shared. From the first step to the last laugh, group travel turns ordinary trips into extraordinary memories, sparking joy that lingers.`}
              />
              <TextCard
                icon={<PerfectTrip />}
                title="Connections That Go Deeper"
                text={`Our journeys are designed to bring people together. Through shared experiences, each traveler becomes part of a story, creating bonds that feel like they were always meant to be.`}
              />
              <div className="mx-auto flex flex-col items-center justify-center text-center md:hidden px-4">
                <SeamlessTravel className="my-2.5 w-10 h-10" />
                <h2 className="mb-2 text-lg font-bold">Memories That Stay Long After</h2>
                <p className="text-xs leading-relaxed text-gray-700 max-w-[90vw]">
                  {`It’s not just about where we go; it’s about the lasting impact. Each journey leaves behind stories, friendships, and experiences that live on, well beyond the trip.`}
                </p>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="mx-auto flex flex-col items-center justify-center text-center">
                <SeamlessTravel className="my-2.5 w-12 h-12" />
                <h2 className="mb-2 text-xl font-bold md:text-2xl">Memories That Stay Long After</h2>
                <p className="text-xs leading-relaxed text-gray-700 md:w-[23%]">
                  {`It’s not just about where we go; it’s about the lasting impact. Each journey leaves behind stories, friendships, and experiences that live on, well beyond the trip.`}
                </p>
              </div>
              <div className="absolute bottom-[7.5%] left-[29.5%] hidden md:block">
                <LeftFoot className="w-16 h-16" />
              </div>
              <div className="absolute bottom-[8.5%] right-[30.4%] hidden md:block">
                <RightFoot className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative mx-1 mt-10 flex items-center justify-between rounded-3xl bg-gray-200 px-2 py-10 sm:mx-4 md:mx-40 md:mt-24">
        <div className="absolute -left-32 hidden md:block">
          <Image
            className="h-60 w-60"
            src={BackpackIcon}
            alt="Backpack"
            width={240}
            height={240}
          />
        </div>
        <div className="absolute -right-36 -top-28 hidden md:block">
          <Image
            className="h-60 w-60"
            src={TentIcon}
            alt="Tent"
            width={240}
            height={240}
          />
        </div>

        <div className="no-scrollbar ml-0 flex flex-row space-x-4 overflow-x-auto px-2 md:ml-20">
          <FeatureCard
            icon={<Icon1 />}
            title="Hassle-Free Experience"
            description="We manage every detail to ensure a smooth, enjoyable journey."
          />
          <Divider />
          <FeatureCard
            icon={<Icon2 />}
            title="Expert Trip Planning"
            description="Every detail is flawlessly organized by our experienced team"
          />
          <Divider />
          <FeatureCard
            icon={<Icon3 />}
            title="70% Returning Clients"
            description="Satisfied clients choose to travel with us again."
          />
          <Divider />
          <FeatureCard
            icon={<Icon4 />}
            title="New Friendships & Memories"
            description="Meet like-minded travelers and form lifelong friendships."
          />
        </div>
      </div>
    </div>
  );
};

const TextCard = ({ icon, title, text }) => (
  <div className="flex flex-col items-center justify-center text-center px-4">
    <div className="my-2.5">{icon}</div>
    <h2 className="mb-2 text-lg font-bold md:text-2xl">{title}</h2>
    <p className="text-xs leading-relaxed text-gray-700 max-w-[90vw] sm:max-w-[80vw] md:max-w-[50%]">
      {text}
    </p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-left px-2 min-w-[250px] sm:min-w-[300px]">
    <div className="mb-4 flex justify-start">{icon}</div>
    <h3 className="mb-2 text-base font-semibold md:text-xl">{title}</h3>
    <p className="text-sm leading-relaxed text-gray-600">{description}</p>
  </div>
);

const Divider = () => (
  <div className="min-h-full min-w-[0.5px] bg-buttonBackground"></div>
);

export default JourneySection;
