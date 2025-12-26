"use client"

import CustomText from '../../components/CustomText'
import AdminTopbar from '../../components/AdminTopbar'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../components/CustomButton'
// import AddIcon from '@/_assets/svgs/logo/AddIcon'
// import EditIcon from '@/_assets/svgs/logo/EditIcon'
import ThreedotIcon from '@/_assets/svgs/logo/ThreedotIcon'
// import { light } from '@/_assets/themes/themes'
import CustomModal from '../../components/CustomModal'
import CustomSelect from '../../components/CustomSelect'
// import CustomInputFile from '../../components/CustomInputFile'
// import { MdLocationPin } from 'react-icons/md'
import CustomRadioButtonGroup from '../../components/CustomRadioButtonGroup'
import { MenuItem, Pagination, PaginationItem, styled } from '@mui/material'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'
import { get, patch, post, put } from '../../constants/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import globalSlice, { setValue } from '@/lib/globalSlice'
import PaginationComp from '../../components/PaginationComp'
// import CustomInput from '../../components/CustomInput'
// import CustomAccordion from '../../components/CustomAccordion'
import { useRouter } from 'next/navigation'
import { PAGES } from '../../constants/PagesName'
import moment from 'moment'
import SinglePerson from '@/_assets/svgs/logo/SinglePerson'
import Upgraph from '@/_assets/svgs/logo/Upgraph'
import Downgraph from '@/_assets/svgs/logo/Downgraph'
import { TiTick } from 'react-icons/ti'
import { ImCross } from 'react-icons/im'
import { localStorageHelper } from '../../helper/storageHelper'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import useAuthRedirect from '@/hooks/useAuthRedirect'

function Requests() {

  useAuthRedirect();

  const [state, setState] = useState({
    is_modalopen: false,
    fetched_data: [],
    misc_data: null,
    iscall_fetched_data: [],
    temp_data: [],
    callback_request_data_without_status: [],
    callback_request_misc_data_without_status: null,
    current_page: 1,
    total_pages: 0,
    next_cursor_id: 0,
    prev_cursor_id: 0,
    selected_request: {},
    menu_select_data: 'Custom Requests',
    to_show_request_menu_index: null
  })
  const RequestStatus = [
    'REQUESTED',
    'CONTACTED',
    'INTERESTED',
    'NOT_INTERESTED',
    'BOOKED'
  ]
  const fetch_All_REQUEST_WITHOUT_STATUS = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      const api_request = API_ENDPOINTS.ADMIN.GET_REQUEST + '?isCall=true'
      await get(api_request).then((d) => {
        if (d?.message == 'REQUESTS_FETCHED' && d?.success == true) {
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          setState((prevs) => ({
            ...prevs,
            callback_request_data_without_status: d?.data?.requests,
            callback_request_misc_data_without_status: d?.data,
            temp_data: d?.data?.requests,
            total_pages: d?.data?.totalPages,
            next_cursor_id: d.data?.nextCursor,
            prev_cursor_id: d.data?.previousCursor,
            menu_select_data: 'Callback Requests'
          }))
        }
      })
    } catch (error) {
      dispatch(setValue({ key: 'to_show_loader', value: false }))
      console.error(error)
      const err_response = error?.response?.data
      if (
        err_response.success == false &&
        err_response.message == 'VALIDATION_INVALID_TOKEN'
      ) {
        // localStorageHelper.removeItem('login_data')
        // router.push(PAGES.LOGIN, { replace: true })
        console.log('logging out')
      }
    }
  }
  const dispatch = useDispatch()
  const router = useRouter()
  const CurrentYear = moment().year()
  const CurrentMonth = moment().format('MMMM')
  const fetch_All_REQUEST = async ({ isCall = false, cursor_id = null }) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      const api_request =
        isCall == true
          ? API_ENDPOINTS.ADMIN.GET_REQUEST +
            '?isCall=true&status=REQUESTED' +
            `${cursor_id != null ? '&cursor=' + cursor_id : ''}`
          : API_ENDPOINTS.ADMIN.GET_REQUEST +
            `${cursor_id != null ? '?cursor=' + cursor_id : ''}`
      await get(api_request).then((d) => {
        if (d?.message == 'REQUESTS_FETCHED' && d?.success == true) {
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          if (isCall == true) {
            setState((prevs) => ({
              ...prevs,
              // misc_data: d?.data,
              // total_pages: d?.data?.totalPages,
              // next_cursor_id: d.data?.nextCursor,
              // prev_cursor_id: d.data?.previousCursor,
              iscall_fetched_data: isCall ? d?.data?.requests : [],
              menu_select_data: 'Custom Requests'
            }))
          } else {
            setState((prevs) => ({
              ...prevs,
              fetched_data: d?.data?.requests,
              misc_data: d?.data,
              total_pages: d?.data?.totalPages,
              next_cursor_id: d.data?.nextCursor,
              prev_cursor_id: d.data?.previousCursor,
              temp_data: d?.data?.requests,
              menu_select_data: 'Custom Requests'
            }))
          }
        }
      })
    } catch (error) {
      dispatch(setValue({ key: 'to_show_loader', value: false }))
      console.error(error)
      const err_response = error?.response?.data
      if (
        err_response.success == false &&
        err_response.message == 'VALIDATION_INVALID_TOKEN'
      ) {
        localStorageHelper.removeItem('login_data')
        router.push(PAGES.LOGIN, { replace: true })
      }
    }
  }
  const update_Request_Status = async ({ id = 0, status, isCall = true }) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      await patch(
        API_ENDPOINTS.ADMIN.UPDATE_REQUEST_STATUS +
          `?id=${id}&status=${status}${isCall ? '&isCall=true' : ''}`
      ).then((d) => {
        if (d?.message == 'REQUEST_STATUS_UPDATED' && d?.success == true) {
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          dispatch(
            setValue({
              key: 'to_show_alert',
              value: true
            })
          ),
            dispatch(
              setValue({
                key: 'alert_content',
                value: 'Request Status Updated Successfully'
              })
            )
          fetch_All_REQUEST({ isCall: false }).then(() => {
            fetch_All_REQUEST({ isCall: true }).then(() => {
              if (isCall) {
                fetch_All_REQUEST_WITHOUT_STATUS()
              }
            })
          })
        }
      })
    } catch (error) {
      dispatch(setValue({ key: 'to_show_loader', value: false }))
      console.error(error)
      const err_response = error?.response?.data
      if (
        err_response.success == false &&
        err_response.message == 'VALIDATION_INVALID_TOKEN'
      ) {
        localStorageHelper.removeItem('login_data')
        router.push(PAGES.LOGIN, { replace: true })
      }
    }
  }

  const RequestMenu = ({ item, index }) => {
    return (
      <td className="px-4 py-2 text-center select-none cursor-pointer ">
        <div
          className={`${
            {
              REQUESTED: 'bg-[#F2C94C]',
              CONTACTED: 'bg-[#56CCF2]',
              INTERESTED: 'bg-[#A6D785]',
              NOT_INTERESTED: 'bg-[#EB5757]',
              BOOKED: 'bg-[#27AE60]'
            }[item.status || 'REQUESTED'] || 'bg-[#A6D785]'
          } rounded-2xl mx-2 py-2 relative `}
          onClick={() => {
            if (state.to_show_request_menu_index == index) {
              setState((prevs) => ({
                ...prevs,
                to_show_request_menu_index: null
              }))
            } else {
              setState((prevs) => ({
                ...prevs,
                to_show_request_menu_index: index
              }))
            }
          }}
        >
          <div className="flex justify-center items-center">
            <CustomText
              content={item?.status || 'NA'}
              className="text-white"
              fontsize="13px"
              secondaryfontweight
            />
            <MdOutlineKeyboardArrowDown
              size={30}
              color="white"
              className="-mr-2"
            />
          </div>
          {state.to_show_request_menu_index == index && (
            <div
              className={`bg-white absolute top-10 right-0 z-[99] shadow-2xl rounded-md py-2  `}
            >
              {RequestStatus.map((menu_item, status_index) => (
                <MenuItem
                  onClick={() => {
                    update_Request_Status({
                      id: item?.id,
                      status: menu_item,
                      isCall: item?.destination != undefined ? false : true
                    })
                  }}
                  key={status_index}
                  value={menu_item}
                >
                  <CustomText content={menu_item} className="text-black" />
                </MenuItem>
              ))}
            </div>
          )}
        </div>
      </td>
    )
  }
  const NewRequestCard = ({ item, index }) => {
    return (
      <div className=" py-4  border-2 border-[#C9C9C9] rounded-md p-5">
        <div className="flex justify-between">
          <div>
            <div className="flex">
              <div>
                <CustomText
                  content={item?.name}
                  primaryfontweight
                  fontsize="22px"
                  className="text-signinbtnbackground"
                />
                <div className="flex my-2">
                  <div className="bg-[#3A3A3A] p-2  rounded-md mt-1 ">
                    <CustomText
                      content={`Start Date : ${moment(item?.start_date).format(
                        'MMMM YYYY'
                      )}`}
                      className="text-white text-nowrap"
                      fontsize="7px"
                      secondaryfontweight
                    />
                  </div>
                </div>
              </div>
              <div className="ml-10 flex gap-4">
                <div
                  onClick={() =>
                    update_Request_Status({ id: item?.id, status: 'CONTACTED' })
                  }
                  className="cursor-pointer transition-transform transform duration-75 active:scale-95 bg-green-500  flex justify-center items-center select-none"
                  style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px'
                  }}
                >
                  <TiTick size={30} color="white" />
                </div>
                <div
                  onClick={() =>
                    update_Request_Status({
                      id: item?.id,
                      status: 'NOT_INTERESTED'
                    })
                  }
                  className="cursor-pointer transition-transform transform duration-75 active:scale-95 bg-red-600  flex justify-center items-center select-none"
                  style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px'
                  }}
                >
                  <ImCross size={20} color="white" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CustomText
                content={`By : ${item?.name}`}
                className="text-black "
                fontsize="11.6px"
                secondaryfontweight
              />
              <div className="flex">
                <CustomText
                  content={`Phone No. : ${item?.phone} `}
                  className="text-black"
                  fontsize="10.55px"
                />
                <div className="w-[1px] bg-[#6E7684] self-stretch mx-2" />
                <CustomText
                  content={`Email ID : ${item?.email}`}
                  fontsize="11px"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {(item?.activities || [])?.map((item, index) => (
                  <div
                    className="border-2 border-[#CACACA] p-[4px] rounded-2xl "
                    style={{ display: 'flex', alignSelf: 'center' }}
                  >
                    <CustomText
                      content={item}
                      fontsize="10px"
                      className="text-center"
                    />
                  </div>
                ))}
              </div>
              <div>
                <CustomText
                  fontsize="8px"
                  content={`Details : ${item?.description}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetch_All_REQUEST({ isCall: false }).then(() => {
      fetch_All_REQUEST({ isCall: true })
    })
  }, [])
  return (
    <div className=" h-screen w-full flex  bg-white">
      <div className="w-full bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-60 ">
        <AdminTopbar topbar_title={'Bookings'} />

        <div className="flex gap-4">
          <div className="flex flex-[1] flex-col">
            <div className="mb-4 flex   justify-between px-4 pr-6 py-4 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
              <div className="mr-9">
                <SinglePerson />
                <CustomText
                  className="mt-4"
                  secondaryfontsize
                  secondaryfontweight
                  content={'Total Requests'}
                />
                <CustomText
                  fontsize="7px"
                  content={`Year ${CurrentYear}`}
                  className="-mt-1 ml-[2px]"
                />
              </div>
              <div className="flex flex-col  items-end w-100">
                <CustomText
                  content={
                    state.misc_data?.total_request_current_year
                      ?.total_request_current_year || 0
                  }
                  className={`mb-6  ${
                    (state.misc_data?.total_request_current_year?.is_up ||
                      false) == true
                      ? 'text-graphtextgreen'
                      : 'text-signinbtnbackground'
                  } `}
                  fontsize="24px"
                />
                {(state.misc_data?.total_request_current_year?.is_up ||
                  false) == true ? (
                  <Upgraph />
                ) : (
                  <Downgraph />
                )}
              </div>
            </div>
            <div className="flex   justify-between px-4 pr-6 py-4 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
              <div className="mr-9">
                <SinglePerson />
                <CustomText
                  className="mt-4"
                  secondaryfontsize
                  secondaryfontweight
                  content={'Pending Requests'}
                />
                <CustomText
                  fontsize="7px"
                  content={`Year ${CurrentYear}`}
                  className="-mt-1 ml-[2px]"
                />
              </div>
              <div className="flex flex-col  items-end w-100">
                <CustomText
                  content={state.misc_data?.total_pending_request || 0}
                  className={`mb-6  ${'text-signinbtnbackground'} `}
                  fontsize="24px"
                />
                {/* {(state.fetched_data?.currentYearData?.bookings?.[1] ||
                  false) == true ? (
                  <Upgraph />
                ) : (
                  <Downgraph />
                )} */}
              </div>
            </div>
          </div>
          <div className="flex flex-[2] ">
            <div className=" px-4 pr-6  bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
              <CustomText
                content={'New Requests'}
                fontsize="19px"
                primaryfontweight
                className="my-4"
              />
              <div className="flex max-w-[850px] gap-4 overflow-x-scroll no-scrollbar pb-4">
                {state.iscall_fetched_data?.length > 0 ? (
                  (state.iscall_fetched_data || [])?.map((item, index) => (
                    <NewRequestCard key={index} item={item} index={index} />
                  ))
                ) : (
                  <div className="flex flex-1 justify-center items-center ">
                    <CustomText
                      content={'No data available'}
                      className="text-[14px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end  mt-4  cursor-pointer select-none">
          <div
            className="transition-transform transform duration-75 active:scale-95"
            onClick={() => {
              fetch_All_REQUEST({ isCall: false }).then(() => {
                fetch_All_REQUEST({ isCall: true }).then(() => {
                  setState((prevs) => ({ ...prevs, current_page: 1 }))
                  if (
                    state.callback_request_data_without_status?.length > 0 &&
                    state.menu_select_data == 'Callback Requests'
                  ) {
                    fetch_All_REQUEST_WITHOUT_STATUS()
                  }
                })
              })
            }}
          >
            <CustomText
              content={'Reload Request Content'}
              className="rounded-full bg-signinbtnbackground py-2 px-4 text-white"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-between mt-4">
          <CustomText
            secondaryfontweight
            fontsize="16px"
            content={'List of Requests'}
            className="text-black"
          />
          <CustomSelect
            fontSize={'11px'}
            option_data={['Custom Requests', 'Callback Requests']}
            border_color="rgba(110, 118, 132, 0.33)"
            padding="2px"
            selectedValue={state.menu_select_data}
            onChange={(e) => {
              setState((prevs) => ({
                ...prevs,
                menu_select_data: e
              }))

              if (
                e == 'Callback Requests' &&
                state.callback_request_data_without_status?.length == 0
              ) {
                fetch_All_REQUEST_WITHOUT_STATUS()
              } else if (
                e == 'Callback Requests' &&
                state.callback_request_data_without_status?.length > 0
              ) {
                setState((prevs) => ({
                  ...prevs,
                  total_pages:
                    state.callback_request_misc_data_without_status?.totalPages,
                  next_cursor_id:
                    state.callback_request_misc_data_without_status?.nextCursor,
                  prev_cursor_id:
                    state.callback_request_misc_data_without_status
                      ?.previousCursor,
                  temp_data:
                    state.callback_request_misc_data_without_status?.requests
                }))
              } else {
                setState((prevs) => ({
                  ...prevs,
                  total_pages: state.misc_data?.totalPages,
                  next_cursor_id: state.misc_data?.nextCursor,
                  prev_cursor_id: state.misc_data?.previousCursor,
                  temp_data: state.misc_data?.requests
                }))
              }
            }}
          />
        </div>

        <div className=" mt-3">
          <table className="min-w-full border-collapse text-center  ">
            <thead className="bg-inputbg rounded-full p-5">
              <tr>
                <th className="rounded-l-lg px-4 py-2 text-start">
                  <CustomText
                    content={'Req No.'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-start">
                  <CustomText
                    content={'Name'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-start">
                  <CustomText
                    content={'Phone'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                {state.menu_select_data == 'Custom Requests' && (
                  <th className=" px-4 py-2 text-start">
                    <CustomText
                      content={'Destination'}
                      fontsize="13px"
                      secondaryfontweight
                    />
                  </th>
                )}
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={
                      state.menu_select_data == 'Custom Requests'
                        ? 'No. of Night Stays'
                        : 'Email'
                    }
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                {state.menu_select_data == 'Custom Requests' && (
                  <th className=" px-4 py-2 text-center">
                    <CustomText
                      content={'No. of People'}
                      fontsize="13px"
                      secondaryfontweight
                    />
                  </th>
                )}
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={'Date'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                {state.menu_select_data == 'Custom Requests' && (
                  <th className=" px-4 py-2 text-center">
                    <CustomText
                      content={'Mode of Travel'}
                      fontsize="13px"
                      secondaryfontweight
                    />
                  </th>
                )}
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={'Status'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className="rounded-r-lg px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="w-auto">
              {state.temp_data?.length > 0 ? (
                state.temp_data?.map((item, index) => (
                  <React.Fragment key={item?.id || index}>
                    <tr>
                      <td className="px-4 py-2">
                        <CustomText
                          content={index + 1 + '.' || 'NA'}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-start">
                        <CustomText
                          content={item?.name || 'NA'}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-start">
                        <CustomText
                          content={item?.phone || 'NA'}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {item?.destination && (
                        <td className="px-4 py-2 text-start">
                          <CustomText
                            content={item?.destination || 'NA'}
                            fontsize="13px"
                            secondaryfontweight
                          />
                        </td>
                      )}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={
                            item?.night_stay_count || item?.email || 'NA'
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {item?.people_count && (
                        <td className="px-4 py-2 text-center">
                          <CustomText
                            content={item?.people_count || 'NA'}
                            fontsize="13px"
                            secondaryfontweight
                          />
                        </td>
                      )}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={
                            moment(item?.start_date).format('DD MMM') || 'NA'
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {state.menu_select_data == 'Custom Requests' && (
                        <td className="px-4 py-2 text-center">
                          <CustomText
                            content={item?.travel_mode || 'NA'}
                            fontsize="13px"
                            secondaryfontweight
                          />
                        </td>
                      )}
                      <RequestMenu item={item} index={index} />
                      {/* <td className="px-4 py-2 w-2 mx-auto">
                        <CustomButton
                          className="ml-3"
                          logo_path={<EditIcon />}
                          content={''}
                        />
                      </td> */}
                      <td className="group relative px-4 py-2 w-2 mx-auto">
                        <CustomButton
                          logo_path={<ThreedotIcon />}
                          content={''}
                        />
                        <div className="group-hover:block hidden absolute top-10 right-10 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                          <div
                            onClick={() => {
                              setState((prevs) => ({
                                ...prevs,
                                is_modalopen: true,
                                selected_request: item
                              }))
                              //  fetch_Bookings_Id({ id: item?.id })
                            }}
                            className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                          >
                            View Request
                          </div>
                          {/* <div className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                            Inactive
                          </div>

                          <div className="text-deletetextcolor cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                            Delete
                          </div> */}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="100%" className="p-0">
                        <hr className="w-full my-1 bg-bordercolor" />
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end ">
            <PaginationComp
              total_pages={state.total_pages}
              current_page={state.current_page}
              prevonClick={() => {
                if (
                  state.current_page - 1 != 0 &&
                  state.prev_cursor_id?.length > 0
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page - 1
                  }))
                  if (state.menu_select_data == 'Custom Requests') {
                    fetch_All_REQUEST({ cursor_id: state.prev_cursor_id })
                  } else {
                    fetch_All_REQUEST({
                      isCall: true,
                      cursor_id: state.prev_cursor_id
                    })
                  }
                }
              }}
              onClick={(e) => {
                if (
                  state.current_page != e &&
                  state.next_cursor_id?.length > 0 &&
                  state.current_page + 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }))
                  if (state.menu_select_data == 'Custom Requests') {
                    fetch_All_REQUEST({ cursor_id: state.next_cursor_id })
                  } else {
                    fetch_All_REQUEST({
                      isCall: true,
                      cursor_id: state.next_cursor_id
                    })
                  }
                } else if (
                  state.current_page != e &&
                  state.prev_cursor_id?.length > 0 &&
                  state.current_page - 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }))
                  if (state.menu_select_data == 'Custom Requests') {
                    fetch_All_REQUEST({ cursor_id: state.prev_cursor_id })
                  } else {
                    fetch_All_REQUEST({
                      isCall: true,
                      cursor_id: state.prev_cursor_id
                    })
                  }
                }
              }}
              nextonClick={() => {
                if (
                  state.current_page + 1 <= state.total_pages &&
                  state.next_cursor_id?.length > 0
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page + 1
                  }))
                  if (state.menu_select_data == 'Custom Requests') {
                    fetch_All_REQUEST({ cursor_id: state.next_cursor_id })
                  } else {
                    fetch_All_REQUEST({
                      isCall: true,
                      cursor_id: state.next_cursor_id
                    })
                  }
                }
              }}
            />
          </div>
        </div>
        <CustomModal
          open={state.is_modalopen}
          handleClose={() =>
            setState((prevs) => ({ ...prevs, is_modalopen: false }))
          }
          title={''}
          description={``}
          restContent={
            <div>
              {state.selected_request?.id?.length > 0 ? (
                <div className="text-start">
                  <CustomText
                    fontsize="34.94px"
                    primaryfontweight
                    content={state.selected_request?.destination}
                    className="mb-4"
                  />
                  <CustomText
                    fontsize="18px"
                    content={
                      'Request ID : $' + state.selected_request?.id.slice(-5)
                    }
                  />
                  <div className=" mt-2">
                    <div className="flex items-center justify-start">
                      <div className="flex mt-4">
                        <CustomText
                          content={'Full Name : '}
                          primaryfontweight
                          fontsize="16.39px"
                        />
                        <CustomText content={state.selected_request?.name} />
                      </div>
                      <div className="w-[1px] mt-4 bg-[#6E7684] self-stretch mx-2" />
                      <div className="flex mt-4">
                        <CustomText
                          content={'Email :'}
                          primaryfontweight
                          fontsize="16.39px"
                        />
                        <CustomText content={state.selected_request?.email} />
                      </div>
                    </div>

                    <div className="flex items-center justify-start">
                      <div className="flex mt-4">
                        <CustomText
                          content={'Phone : '}
                          primaryfontweight
                          fontsize="16.39px"
                        />
                        <CustomText content={state.selected_request?.phone} />
                      </div>
                      {state.menu_select_data == 'Custom Requests' && (
                        <div className="w-[1px] mt-4 bg-[#6E7684] self-stretch mx-2" />
                      )}
                      {state.menu_select_data == 'Custom Requests' && (
                        <div className="flex mt-4">
                          <CustomText
                            content={'Destination :'}
                            primaryfontweight
                            fontsize="16.39px"
                          />
                          <CustomText
                            content={state.selected_request?.destination}
                          />
                        </div>
                      )}
                      {state.menu_select_data == 'Custom Requests' && (
                        <div className="w-[1px] mt-4 bg-[#6E7684] self-stretch mx-2" />
                      )}
                      {state.menu_select_data == 'Custom Requests' && (
                        <div className="flex mt-4">
                          <CustomText
                            content={'Source :'}
                            primaryfontweight
                            fontsize="16.39px"
                          />
                          <CustomText
                            content={state.selected_request?.source}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-start">
                      <div className="flex mt-4">
                        <CustomText
                          content={'Start Date : '}
                          primaryfontweight
                          fontsize="16.39px"
                        />
                        <CustomText
                          content={moment(
                            state.selected_request?.start_date
                          ).format('DD MMMM YYYY')}
                        />
                      </div>
                      {state.menu_select_data == 'Custom Requests' && (
                        <div className="w-[1px] mt-4 bg-[#6E7684] self-stretch mx-2" />
                      )}
                      {state.menu_select_data == 'Custom Requests' && (
                        <div className="flex mt-4">
                          <CustomText
                            content={'No. of People :'}
                            primaryfontweight
                            fontsize="16.39px"
                          />
                          <CustomText
                            content={
                              state.selected_request?.people_count + 'Adults'
                            }
                          />
                        </div>
                      )}
                    </div>
                    {state.menu_select_data == 'Custom Requests' && (
                      <div className="flex items-center justify-start">
                        <div className="flex mt-4">
                          <CustomText
                            content={'Preferred Hotel : '}
                            primaryfontweight
                            fontsize="16.39px"
                          />
                          <CustomText
                            content={state.selected_request?.preferred_hotel}
                          />
                        </div>
                        <div className="w-[1px] mt-4 bg-[#6E7684] self-stretch mx-2" />
                        <div className="flex mt-4">
                          <CustomText
                            content={'No. of Night Stays :'}
                            primaryfontweight
                            fontsize="16.39px"
                          />
                          <CustomText
                            content={
                              ' ' +
                              state.selected_request?.night_stay_count -
                              1 +
                              ' Days ' +
                              state.selected_request?.night_stay_count +
                              ' Nights'
                            }
                          />
                        </div>
                      </div>
                    )}

                    {state.menu_select_data == 'Custom Requests' && (
                      <div className="mt-4">
                        <CustomRadioButtonGroup
                          label="Mode of Travel:"
                          name="options"
                          options={[
                            { value: 'SELF', label: 'SELF' },
                            { value: 'Train', label: 'Train' },
                            { value: 'Flight', label: 'Flight' }
                          ]}
                          fontSize="16.39px"
                          color="text-black"
                          selectedValue={state.selected_request?.travel_mode}
                          //   onChange={handleChange}
                        />
                      </div>
                    )}
                    {state.menu_select_data == 'Custom Requests' && (
                      <div className="mt-1 flex">
                        <CustomText
                          content={'Activites :'}
                          primaryfontweight
                          fontsize="16.39px"
                        />
                        <div className="flex gap-2 ml-4">
                          {(state.selected_request?.activities || [])?.map(
                            (item, index) => (
                              <div
                                className="border-2 border-[#CACACA] p-[4px] rounded-2xl "
                                style={{ display: 'flex', alignSelf: 'center' }}
                              >
                                <CustomText
                                  content={item}
                                  fontsize="10px"
                                  className="text-center"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex mt-2">
                      <CustomText
                        content={'Remarks :'}
                        primaryfontweight
                        fontsize="16.39px"
                        className="text-nowrap"
                      />
                      <CustomText
                        content={
                          state.selected_request?.requirements ||
                          state.selected_request?.description
                        }
                        fontsize="14px"
                        className="ml-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <CustomText
                    content={'No data available'}
                    className="text-black"
                  />
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  )
}

export default Requests
