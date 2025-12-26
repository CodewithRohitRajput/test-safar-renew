import CustomSelect from '../../../components/CustomSelect'
import React, { useState } from 'react'
import CustomeSelectTravler from '../components/CustomeSelectTravler'
import CustomText from '../../../components/CustomText'
import { useDispatch } from 'react-redux'
import { addPeopleDetails } from '@/lib/thunks/addPeopleDetails'
import { useRouter } from 'next/navigation'
import CustomInput from '../../../components/CustomInput'

const TravellerForm = ({
  isOpen,
  onClose,
  base_packages,
  pickup_point,
  drop_point,
  selectedBatch,
  selectedDroppingPoint,
  selectedPackage,
  selectedStartingPoint,
  prepeople = []
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [people, setPeople] = useState(
    prepeople.length > 0
      ? prepeople.map((person) => ({
          firstName: person.firstName || '',
          lastName: person.lastName || '',
          baseCity: person.baseCity || '',
          birthDate: person.birthDate || '',
          contactNumber: person.contactNumber || '',
          email: person.email || '',
          gender: person.gender || '',
          age: person.age || '',
          instagramID: person.instagramID || '',
          startingPoint: person.startingPoint || selectedStartingPoint || '', // fallback to default pickup point
          droppingPoint: person.droppingPoint || selectedDroppingPoint || '', // fallback to default drop point
          selectedPackage: person.selectedPackage || selectedPackage || null,
          selectedBatch: selectedBatch || null // fallback to selected package
        }))
      : [
          {
            firstName: '',
            lastName: '',
            baseCity: '',
            birthDate: '',
            contactNumber: '',
            email: '',
            gender: '',
            instagramID: '',
            age: '',
            startingPoint: selectedStartingPoint || '', // use default pickup point if provided
            droppingPoint: selectedDroppingPoint || '', // use default drop point if provided
            selectedPackage: selectedPackage || null,
            selectedBatch: selectedBatch || null // for room package selection
          }
        ]
  )

  const [showSummary, setShowSummary] = useState(
    prepeople.length > 0 ? prepeople.map(() => true) : [false] // Set summary to show if prefilled
  )

  if (!isOpen) return null

  const addPerson = () => {
    setPeople([
      ...people,
      {
        firstName: '',
        lastName: '',
        baseCity: '',
        birthDate: '',
        contactNumber: '',
        email: '',
        gender: '',
        age: '',
        instagramID: '',
        startingPoint: selectedStartingPoint || '', // use default pickup point if provided
        droppingPoint: selectedDroppingPoint || '', // use default drop point if provided
        selectedPackage: selectedPackage || null,
        selectedBatch: selectedBatch || null // for room package selection
      }
    ])

    setShowSummary([...showSummary, false]) // Add a new summary state for the new person
  }
  const [errors, setErrors] = useState({}) // to store error messages for fields

  const validateFields = () => {
    const newErrors = {}
    let isValid = true

    people.forEach((person, index) => {
      if (!person.firstName) {
        newErrors[`firstName_${index}`] = 'First name is required'
        isValid = false
      }
      if (!person.lastName) {
        newErrors[`lastName_${index}`] = 'Last name is required'
        isValid = false
      }
      if (!person.contactNumber || person.contactNumber.length < 10) {
        newErrors[`contactNumber_${index}`] = 'Contact number is required'
        isValid = false
      }
      if (!person.email) {
        newErrors[`email_${index}`] = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
        newErrors[`email_${index}`] = 'Invalid email format'
        isValid = false
      }
      if (!person.age || person.age < 1|| person.age >100) {
        newErrors[`age_${index}`] = 'Age is required'
        isValid = false
      }
      if (!person.gender && person.gender != 'Select Gender') {
        newErrors[`gender_${index}`] = 'Gender is required'
        isValid = false
      }
      if (!person.baseCity) {
        newErrors[`baseCity_${index}`] = 'Basecity is required'
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (index, field, value) => {
    const updatedPeople = [...people]
    updatedPeople[index][field] = value
    setPeople(updatedPeople)
  }
  const removePerson = (index) => {
    const updatedPeople = people.filter(
      (_, personIndex) => personIndex !== index
    )
    const updatedShowSummary = showSummary.filter(
      (_, summaryIndex) => summaryIndex !== index
    )

    setPeople(updatedPeople)
    setShowSummary(updatedShowSummary)
  }

  const handleRoomChange = (index, selectedPackage) => {
    const updatedPeople = [...people]
    updatedPeople[index].selectedPackage = selectedPackage
    setPeople(updatedPeople)
  }

  const toggleSummary = (index) => {
    if (!validateFields()) return
    const updatedSummaries = [...showSummary]
    updatedSummaries[index] = !updatedSummaries[index]
    setShowSummary(updatedSummaries)
  }

  const handleBooking = async () => {
    if (!validateFields()) return
    dispatch(addPeopleDetails(people))
    onClose()
    router.push(`/booking/summary`)
  }

  return (
    <>
      <div className="bg-white mx-auto w-full max-w-6xl md:block hidden text-start rounded-lg relative max-h-[100vh] overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center"></h2>

        <p className="text-center text-gray-600 mb-6"></p>

        {people.map((person, index) => (
          <div key={index} className="mb-6  border-black p-2">
            {showSummary[index] ? (
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold">Person {index + 1} </span>
                  <span>
                    {person.firstName} {person.lastName} |{' '}
                  </span>
                  <span> {person.baseCity} | </span>
                  <span>{person.contactNumber} | </span>
                  <span>{person.email} | </span>
                  <span>{person.gender} | </span>
                  <span>
                    {person.startingPoint.name} to {person.droppingPoint.name}
                  </span>
                </div>
                <div>
                  <button
                    className="text-blue-500 text-xs mt-2 hover:border-b-2 border-blue-500"
                    onClick={() => toggleSummary(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 text-xs ml-2 mt-2 hover:border-b-2 border-red-500"
                    onClick={() => removePerson(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold">Person {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="First Name"
                      custompadding="p-1"
                      content="First Name"
                      default_input_type={false}
                      backgroundColor="white"
                      contentcolor="black"
                      value={person.firstName || ''}
                      onchange={(e) =>
                        handleChange(index, 'firstName', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`firstName_${index}`]}
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Last Name"
                      custompadding="p-1"
                      content="Enter Your Last Name"
                      default_input_type={true}
                      backgroundColor="white"
                      value={person.lastName || ''}
                      contentcolor="black"
                      onchange={(e) =>
                        handleChange(index, 'lastName', e.target.value)
                      }
                      error_text={errors[`lastName_${index}`]}
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                    />
                  </div>
                  {/* Base City */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Base City"
                      custompadding="p-1"
                      content="Enter City you live in"
                      default_input_type={true}
                      backgroundColor="white"
                      value={person.baseCity || ''}
                      contentcolor="black"
                      onchange={(e) =>
                        handleChange(index, 'baseCity', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`baseCity_${index}`]}
                    />
                  </div>
                  {/* Birth Date */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Age"
                      custompadding="p-1"
                      content="Enter your age"
                      set_input_type={'number'}
                      default_input_type={false}
                      backgroundColor="white"
                      value={person.age || ''}
                      contentcolor="black"
                      onchange={(e) =>
                        handleChange(index, 'age', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`age_${index}`]}
                    />
                  </div>
                  {/* Contact Number */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Contact Number"
                      custompadding="p-1"
                      contentcolor="black"
                      content="Enter your Contact Number"
                      set_input_type="number"
                      default_input_type={false}
                      backgroundColor="white"
                      value={person.contactNumber || ''}
                      onchange={(e) =>
                        handleChange(index, 'contactNumber', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`contactNumber_${index}`]}
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      contentcolor="black"
                      top_title="Email"
                      custompadding="p-1"
                      content="Enter your Email"
                      set_input_type={'email'}
                      default_input_type={false}
                      backgroundColor="white"
                      value={person.email || ''}
                      onchange={(e) =>
                        handleChange(index, 'email', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`email_${index}`]}
                    />
                  </div>
                  {/* Gender */}
                  <div>
                    <CustomeSelectTravler
                      top_title={' Gender'}
                      border_color="0.79px solid #D8D8D8"
                      selectedValue={person.gender || 'Select Gender'}
                      fontSize={'14px'}
                      option_data={['Select Gender', 'MALE', 'FEMALE']}
                      to_disable={false}
                      onChange={(value) => handleChange(index, 'gender', value)}
                      error_text={errors[`gender_${index}`]}
                    />
                  </div>
                  {/* Instagram ID */}
                  <div>
                    <CustomInput
                      contentcolor="black"
                      top_title="Instagram ID"
                      custompadding="p-1"
                      content="Enter your Instagram ID"
                      default_input_type={true}
                      backgroundColor="white"
                      value={person.instagramID || ''}
                      onchange={(e) =>
                        handleChange(index, 'instagramID', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                    />
                  </div>
                  {/* Starting Point */}
                  <div>
                    <div className="w-full">
                      <CustomeSelectTravler
                        top_title={'Starting Point'}
                        fontSize={'14px'}
                        border_color="0.79px solid #D8D8D8"
                        option_data={pickup_point} // Array of room packages from the provided JSON
                        onChange={(value) =>
                          handleChange(index, 'startingPoint', value)
                        }
                        to_disable={false}
                        selectedValue={person.startingPoint}
                        content_destruct={(item) => (
                          <div className="flex items-center justify-between px-20">
                            <CustomText fontsize={'13px'} content={item.name} />
                            <span className="mx-5">|</span>
                            <CustomText
                              fontsize={'13px'}
                              content={`₹${item.price}`}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  {/* Dropping Point */}
                  <div>
                    <div className="w-full">
                      <CustomeSelectTravler
                        top_title={'Dropping Point'}
                        fontSize={'14px'}
                        border_color="0.79px solid #D8D8D8"
                        option_data={drop_point} // Array of room packages from the provided JSON
                        onChange={(value) =>
                          handleChange(index, 'droppingPoint', value)
                        }
                        to_disable={false}
                        selectedValue={person.droppingPoint}
                        content_destruct={(item) => (
                          <div className="flex items-center justify-between px-20">
                            <CustomText fontsize={'13px'} content={item.name} />
                            <span className="mx-5">|</span>
                            <CustomText
                              fontsize={'13px'}
                              content={`₹${item.price}`}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Select Room Package for Each Person */}
                <div className="my-4 flex items-center justify-center gap-4">
                  <label className="text-sm text-nowrap font-medium text-gray-700 mb-2">
                    Select Room Package:{' '}
                    <span className="ml-0.5  left-full font-normal text-red-600">
                      *
                    </span>
                  </label>
                  <div className="w-full">
                    <CustomeSelectTravler
                      fontSize={'14px'}
                      border_color="0.79px solid #D8D8D8"
                      option_data={base_packages} // Array of room packages from the provided JSON
                      onChange={(selectedPackage) =>
                        handleRoomChange(index, selectedPackage)
                      }
                      to_disable={false}
                      selectedValue={person.selectedPackage}
                      content_destruct={(item) => (
                        <div className="flex items-center justify-between px-20">
                          <CustomText fontsize={'13px'} content={item.name} />
                          <span className="mx-5">|</span>
                          <CustomText
                            fontsize={'13px'}
                            content={`₹${item.discounted_price}`}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Room Price Display */}

                <button
                  onClick={() => toggleSummary(index)}
                  className="text-blue-500 text-xs mt-2"
                >
                  Save Details
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addPerson}
          className=" w-fit border text-left text-sm bg-gray-100 border-black  py-2 px-6 rounded-sm mb-6"
        >
          + Add Another Person
        </button>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleBooking}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
      <div className="bg-white w-full md:hidden block  text-start rounded-lg relative max-h-[100vh] overflow-y-auto no-scrollbar">
        {people.map((person, index) => (
          <div
            key={index}
            className="mb-6  w-full border-b-[1px] border-black p-2"
          >
            {showSummary[index] ? (
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold">Person {index + 1} </span>
                  <span>
                    {person.firstName} {person.lastName} |{' '}
                  </span>
                  <span> {person.baseCity} | </span>
                  <span>{person.contactNumber} | </span>
                  <span>{person.email} | </span>
                  <span>{person.gender} | </span>
                  <span>
                    {person.startingPoint.name} to {person.droppingPoint.name}
                  </span>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <button
                    className="text-blue-500 text-xs mt-2 hover:border-b-2 border-blue-500"
                    onClick={() => toggleSummary(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 text-xs ml-2 mt-2 hover:border-b-2 border-red-500"
                    onClick={() => removePerson(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold">Person {index + 1}</h3>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* First Name */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="First Name"
                      content="Enter Your First Name"
                      contentcolor="black"
                      default_input_type={false}
                      set_input_type={'text'}
                      backgroundColor="white"
                      value={person.firstName || ''}
                      onchange={(e) =>
                        handleChange(index, 'firstName', e.target.value)
                      }
                      error_text={errors[`firstName_${index}`]}
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Last Name"
                      contentcolor="black"
                      custompadding="p-1"
                      content="Enter Your Last Name"
                      default_input_type={true}
                      backgroundColor="white"
                      value={person.lastName || ''}
                      onchange={(e) =>
                        handleChange(index, 'lastName', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`lastName_${index}`]}
                    />
                  </div>
                  {/* Base City */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Base City"
                      contentcolor="black"
                      custompadding="p-1"
                      content="Enter City you live in"
                      default_input_type={true}
                      backgroundColor="white"
                      value={person.baseCity || ''}
                      onchange={(e) =>
                        handleChange(index, 'baseCity', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`baseCity_${index}`]}
                    />
                  </div>
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Age"
                      custompadding="p-1"
                      contentcolor="black"
                      content="Enter your age"
                      set_input_type={'number'}
                      backgroundColor="white"
                      value={person.age || ''}
                      onchange={(e) =>
                        handleChange(index, 'age', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`age_${index}`]}
                    />
                  </div>
                  {/* Contact Number */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Contact Number"
                      contentcolor="black"
                      custompadding="p-1"
                      content="Enter your Contact Number"
                      set_input_type={'tel'}
                      backgroundColor="white"
                      value={person.contactNumber || ''}
                      onchange={(e) =>
                        handleChange(index, 'contactNumber', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`contactNumber_${index}`]}
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <CustomInput
                      isRequired={true}
                      top_title="Email"
                      contentcolor="black"
                      custompadding="p-1"
                      content="Enter your Email"
                      set_input_type={'email'}
                      backgroundColor="white"
                      value={person.email || ''}
                      onchange={(e) =>
                        handleChange(index, 'email', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                      error_text={errors[`email_${index}`]}
                    />
                  </div>
                  {/* Gender */}
                  <div>
                    <CustomeSelectTravler
                      error_text={errors[`gender_${index}`]}
                      top_title={' Gender'}
                      border_color="0.79px solid #D8D8D8"
                      selectedValue={person.gender || 'Select Gender'}
                      fontSize={'13px'}
                      option_data={['Select Gender', 'MALE', 'FEMALE']}
                      to_disable={false}
                      onChange={(value) => handleChange(index, 'gender', value)}
                    />
                  </div>
                  {/* Instagram ID */}
                  <div>
                    <CustomInput
                      top_title="Instagram ID"
                      contentcolor="black"
                      custompadding="p-1"
                      content="Enter your Instagram ID"
                      default_input_type={true}
                      backgroundColor="white"
                      value={person.instagramID || ''}
                      onchange={(e) =>
                        handleChange(index, 'instagramID', e.target.value)
                      }
                      // error_text={
                      //   state.to_show_error &&
                      //   state.change_pass?.length == 0 &&
                      //   'Enter the password to continue'
                      // }
                    />
                  </div>
                  {/* Starting Point */}
                  <div>
                    <div className="w-full">
                      <CustomeSelectTravler
                        top_title={'Starting Point'}
                        fontSize={'14px'}
                        border_color="0.79px solid #D8D8D8"
                        option_data={pickup_point} // Array of room packages from the provided JSON
                        onChange={(value) =>
                          handleChange(index, 'startingPoint', value)
                        }
                        to_disable={false}
                        selectedValue={person.startingPoint}
                        content_destruct={(item) => (
                          <div className="flex items-center justify-between ">
                            <CustomText fontsize={'12px'} content={item.name} />
                            <span>|</span>
                            <CustomText
                              fontsize={'12px'}
                              content={`₹${item.price}`}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  {/* Dropping Point */}
                  <div>
                    <div className="w-full">
                      <CustomeSelectTravler
                        top_title={'Dropping Point'}
                        fontSize={'14px'}
                        border_color="0.79px solid #D8D8D8"
                        option_data={drop_point} // Array of room packages from the provided JSON
                        onChange={(value) =>
                          handleChange(index, 'droppingPoint', value)
                        }
                        to_disable={false}
                        selectedValue={person.droppingPoint}
                        content_destruct={(item) => (
                          <div className="flex items-center justify-between ">
                            <CustomText fontsize={'12px'} content={item.name} />
                            <span>|</span>
                            <CustomText
                              fontsize={'12px'}
                              content={`₹${item.price}`}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Select Room Package for Each Person */}
                <div className="my-4  items-center justify-center gap-4">
                  <div className="w-full">
                    <CustomeSelectTravler
                      top_title={'Select Room Package:'}
                      fontSize={'14px'}
                      border_color="0.79px solid #D8D8D8"
                      option_data={base_packages} // Array of room packages from the provided JSON
                      onChange={(selectedPackage) =>
                        handleRoomChange(index, selectedPackage)
                      }
                      to_disable={false}
                      selectedValue={person.selectedPackage}
                      content_destruct={(item) => (
                        <div className="flex items-center justify-between ">
                          <CustomText fontsize={'12px'} content={item.name} />
                          <span className>|</span>
                          <CustomText
                            fontsize={'12px'}
                            content={`₹${item.discounted_price}`}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Room Price Display */}

                <button
                  onClick={() => toggleSummary(index)}
                  className="text-blue-500 text-xs mt-2"
                >
                  Save Details
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addPerson}
          className=" text-black w-full border-gray-400 border-2 text-left text-sm py-2 px-2 rounded-lg mb-6"
        >
          + Add Another Person
        </button>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleBooking}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default TravellerForm
 