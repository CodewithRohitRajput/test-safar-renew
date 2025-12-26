import React from 'react'
import { useSelector } from 'react-redux'

const FinalPaymentPage = ({ prepeople, openPopup}) => {
  return (
    <>
      <div className="  bg-white p-8 md:block hidden w-[65%] rounded-md shadow-lg">
        <h1 className="text-center text-2xl font-semibold mb-8">
          Passenger Details
        </h1>

        {prepeople.map((person, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded-md mb-6"
          >
            <h2 className="font-semibold text-lg mb-4">Person {index + 1} :</h2>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  value={`${person.firstName} ${person.lastName}`}
                  readOnly
                  className="w-full px-4 py-2 text-gray-500 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={person.contactNumber}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold">Base City</label>
                <input
                  type="text"
                  value={person.baseCity}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Email ID</label>
                <input
                  type="text"
                  value={person.email}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold">
                  Room Package
                </label>
                <input
                  type="text"
                  value={`${person.selectedPackage.name} | ${person.selectedPackage.discounted_price}`}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Age</label>
                <input
                  type="text"
                  value={person.age}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold">Gender</label>
                <input
                  type="text"
                  value={person.gender}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-100"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => openPopup()}
            className="px-10 py-3 bg-black text-white rounded-full"
          >
            Edit
          </button>
        </div>
      </div>
      <div className="  bg-white p-4 rounded-md md:hidden block shadow-lg">
        <h1 className="text-center text-lg font-semibold mb-8">
          Passenger Details
        </h1>

        {prepeople.map((person, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded-md mb-6"
          >
            <h2 className="font-semibold text-lg mb-4">Person {index + 1} :</h2>

            <div className="grid grid-cols-1 gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  value={`${person.firstName} ${person.lastName}`}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={person.contactNumber}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">Base City</label>
              <input
                type="text"
                value={person.baseCity}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email ID</label>
              <input
                type="text"
                value={person.email}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Room Package
              </label>
              <input
                type="text"
                value={`${person.selectedPackage.name} | ${person.selectedPackage.discounted_price}`}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="">
                <label className="block  text-sm font-semibold">Gender</label>
                <input
                  type="text"
                  value={person.gender}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block  text-sm font-semibold">Age</label>
                <input
                  type="text"
                  value={person.age}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => openPopup()}
            className="px-10 py-3 bg-black text-white rounded-full"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  )
}

export default FinalPaymentPage
