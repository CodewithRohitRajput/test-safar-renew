"use client"

import CustomText from '../../components/CustomText'
import AdminTopbar from '../../components/AdminTopbar'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../components/CustomButton'
import AddIcon from '@/_assets/svgs/logo/AddIcon'
// import EditIcon from '@/_assets/svgs/logo/EditIcon'
import ThreedotIcon from '@/_assets/svgs/logo/ThreedotIcon'
import { light } from '@/_assets/themes/themes'
import CustomModal from '../../components/CustomModal'
import CustomSelect from '../../components/CustomSelect'
// import CustomInputFile from '../../components/CustomInputFile'
// import { MdLocationPin } from 'react-icons/md'
// import CustomRadioButtonGroup from '../../components/CustomRadioButtonGroup'
// import { Pagination, PaginationItem, styled } from '@mui/material'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'
import { get, patch, post, put, remove } from '../../constants/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import globalSlice, { setValue } from '@/lib/globalSlice'
// import PaginationComp from '../../components/PaginationComp'
import CustomInput from '../../components/CustomInput'
// import CustomAccordion from '../../components/CustomAccordion'
import { localStorageHelper } from '../../helper/storageHelper'
import { showConfirmationDialog } from '../Dialog/ShowConfirmationDialog'
import useAuthRedirect from '@/hooks/useAuthRedirect'


function Admin() {


  useAuthRedirect();
  const [state, setState] = useState({
    is_modalopen: false,
    is_pass_modalopen: false,
    fetched_data: [],
    email: '',
    name: '',
    pass: '',
    pass_type: 'password',
    phone: '',
    role: 'Admin',
    change_pass: '',
    change_pass_type: 'password',
    confirm_change_pass: '',
    confirm_change_pass_type: 'password',
    selected_admin_id: 0,
    to_show_error: false
  })
  const globalState = useSelector((state) => state.global)
  const dispatch = useDispatch()
  const fetch_Admin = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      await get(API_ENDPOINTS.ADMIN.GET_ALL_ADMIN).then((d) => {
        if (d?.message == 'ADMIN_FETCHED' && d?.success == true) {
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          setState((prevs) => ({
            ...prevs,
            fetched_data: d?.data
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
        // navigate(PAGES.LOGIN, { replace: true })
        console.log('logging out')
      }
    }
  }
  const registerNewAdmin = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      const data = {
        name: state.name,
        email: state.email,
        password: state.pass,
        phone: state.phone,
        role: state.role?.toUpperCase()
      }
      if (
        state?.name?.length == 0 ||
        state.email?.length == 0 ||
        state.pass?.length == 0 ||
        state.phone?.length == 0 ||
        state.phone?.length < 10
      ) {
        setState((prevs) => ({ ...prevs, to_show_error: true }))
        dispatch(setValue({ key: 'to_show_loader', value: false }))
        return
      }
      await post(API_ENDPOINTS.ADMIN.REGISTER_NEW_ADMIN, data).then((d) => {
        if (d?.message == 'ADMIN_REGISTERED' && d?.success == true) {
          setState((prevs) => ({ ...prevs, to_show_error: false }))
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          setState((prevs) => ({ ...prevs, is_modalopen: false }))
          dispatch(
            setValue({
              key: 'to_show_alert',
              value: true
            })
          ),
            dispatch(
              setValue({
                key: 'alert_content',
                value: 'Admin Registered Successfully'
              })
            )
          fetch_Admin()
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
        navigate(PAGES.LOGIN, { replace: true })
      }
    }
  }
  const changeAdminPass = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      const data = {
        id: state.selected_admin_id,
        new_password:
          state.change_pass == state.confirm_change_pass && state.change_pass
      }
      if (
        state?.change_pass?.length == 0 ||
        state.confirm_change_pass?.length == 0 ||
        state.change_pass != state.confirm_change_pass
      ) {
        setState((prevs) => ({ ...prevs, to_show_error: true }))
        dispatch(setValue({ key: 'to_show_loader', value: false }))
        return
      }
      await patch(API_ENDPOINTS.ADMIN.CHANGE_ADMIN_PASS, data).then((d) => {
        if (d?.message == 'PASSWORD_UPDATED' && d?.success == true) {
          setState((prevs) => ({ ...prevs, to_show_error: false }))
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          setState((prevs) => ({ ...prevs, is_pass_modalopen: false }))
          dispatch(
            setValue({
              key: 'to_show_alert',
              value: true
            })
          ),
            dispatch(
              setValue({
                key: 'alert_content',
                value: 'Password Changed Successfully'
              })
            )
          fetch_Admin()
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
        navigate(PAGES.LOGIN, { replace: true })
      }
    }
  }
  const deleteAdmin = async ({ id }) => {
    const isConfirmed = await showConfirmationDialog(dispatch)
    if (isConfirmed) {
      dispatch(setValue({ key: 'to_show_loader', value: true }))
      try {
        await remove(API_ENDPOINTS.ADMIN.DELETE_ADMIN + '/' + id).then((d) => {
          if (d?.message == 'ADMIN_DELETED' && d?.success == true) {
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
                  value: 'Admin Profile Deleted Successfully'
                })
              )
            fetch_Admin()
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
          navigate(PAGES.LOGIN, { replace: true })
        }
      }
    }
  }
  const adminRoleUpdate = async ({ id, role }) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      await patch(
        API_ENDPOINTS.ADMIN.ADMIN_ROLE_UPDATE + `/?id=${id}&role=${role}`
      ).then((d) => {
        if (d?.message == 'ROLE_UPDATED' && d?.success == true) {
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
                value: 'Role Updated Successfully'
              })
            )
          fetch_Admin()
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
        navigate(PAGES.LOGIN, { replace: true })
      }
    }
  }
  useEffect(() => {
    fetch_Admin()
  }, [])
  return (
    <div className=" h-screen w-full flex  bg-white">
      <div className="w-full bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-60 ">
        <AdminTopbar topbar_title={'Admins'} />
        <div className="flex flex-wrap justify-between mt-10">
          <CustomText
            secondaryfontweight
            fontsize="16px"
            content={'List of Admin'}
            className="text-black"
          />
          <div className="  justify-center items-center">
            <CustomButton
              logo_path={
                <div className="mr-3">
                  <AddIcon />
                </div>
              }
              content={'Add Admin'}
              btncolor={light.signinbtnbackground}
              onClick={() =>
                setState((prevs) => ({
                  ...prevs,
                  is_modalopen: !prevs.is_modalopen
                }))
              }
            />
          </div>
        </div>
        <div className=" mt-3">
          <table className="min-w-full border-collapse text-center  ">
            <thead className="bg-inputbg rounded-full p-5">
              <tr>
                <th className="rounded-l-lg px-4 py-2 text-center">
                  <CustomText
                    content={'Sr No.'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-start">
                  <CustomText
                    content={'Email ID'}
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
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={'Phone No.'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={'Role'}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2"></th>
                <th className="rounded-r-lg px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="w-auto">
              {state.fetched_data?.length > 0 ? (
                state.fetched_data?.map((item, index) => (
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
                          content={item?.email || 'NA'}
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
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.phone || 'NA'}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.role || 'NA'}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>

                      <td className="group relative px-4 py-2 w-2 mx-auto">
                        <CustomButton
                          logo_path={<ThreedotIcon />}
                          content={''}
                        />
                        <div className="group-hover:block hidden absolute top-10 right-10 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                          {item.role == 'ADMIN' && (
                            <div
                              onClick={() =>
                                adminRoleUpdate({
                                  id: item?.id,
                                  role: 'SUPERADMIN'
                                })
                              }
                              className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                            >
                              Promote
                            </div>
                          )}
                          {item.role == 'SUPERADMIN' && (
                            <div
                              onClick={() =>
                                adminRoleUpdate({ id: item?.id, role: 'ADMIN' })
                              }
                              className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                            >
                              Demote
                            </div>
                          )}
                          <div
                            onClick={() =>
                              setState((prevs) => ({
                                ...prevs,
                                selected_admin_id: item?.id,
                                is_pass_modalopen: true
                              }))
                            }
                            className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                          >
                            Change Password
                          </div>
                          <div
                            onClick={() => deleteAdmin({ id: item?.id })}
                            className="text-deletetextcolor cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                          >
                            Remove
                          </div>
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

          {/* <div className="flex justify-end ">
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
                  //   fetch_itinerary(state.prev_cursor_id)
                }
              }}
              onClick={(e) => {
                if (
                  state.current_page != e &&
                  state.next_cursor_id?.length > 0 &&
                  state.current_page + 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }))
                  //   fetch_itinerary(state.next_cursor_id)
                } else if (
                  state.current_page != e &&
                  state.prev_cursor_id?.length > 0 &&
                  state.current_page - 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }))
                  //   fetch_itinerary(state.prev_cursor_id)
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
                  //   fetch_itinerary(state.next_cursor_id)
                }
              }}
            />
          </div> */}
        </div>
        <CustomModal
          open={state.is_modalopen}
          handleClose={() =>
            setState((prevs) => ({ ...prevs, is_modalopen: false }))
          }
          title={
            <span>
              Add new <strong>Admin</strong>
            </span>
          }
          description={
            'The "Add New Admin" form allows you to create a new admin account by entering user details and assigning administrative privileges.'
          }
          restContent={
            <div>
              <div className=" mt-6">
                <CustomInput
                  top_title="Name"
                  content="Enter your first name"
                  backgroundColor="white"
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      name: e.target.value
                    }))
                  }
                  error_text={
                    state.to_show_error && state.name?.length == 0
                      ? 'Enter the name to continue'
                      : ''
                  }
                />
              </div>
              <div className="flex gap-10 justify-around mt-6">
                <div className="w-full">
                  <CustomInput
                    top_title="Email ID"
                    content="Admin ID"
                    backgroundColor="white"
                    onchange={(e) =>
                      setState((prevs) => ({
                        ...prevs,
                        email: e.target.value
                      }))
                    }
                    error_text={
                      state.to_show_error && state.email?.length == 0
                        ? 'Enter the email id to continue'
                        : ''
                    }
                  />
                </div>
                <div className="w-full">
                  <CustomInput
                    backgroundColor="white"
                    top_title="Phone No."
                    content="+91 92XXX XXX73"
                    default_input_type={false}
                    set_input_type={'tel'}
                    maxLength={10}
                    onchange={(e) => {
                      setState((prevs) => ({
                        ...prevs,
                        phone: e.target.value
                      }))
                    }}
                    error_text={
                      state.to_show_error &&
                      (state.phone?.length == 0 || state.phone?.length < 10)
                        ? state.phone?.length < 10
                          ? 'The phone number should be at least 10 digits'
                          : 'Enter the phone to continue'
                        : ''
                    }
                  />
                </div>
              </div>
              <div className="flex gap-10 justify-around mt-6">
                <div className="w-full">
                  <CustomInput
                    top_title="Password"
                    content=""
                    default_input_type={false}
                    set_input_type={state.pass_type}
                    backgroundColor="white"
                    error_text={
                      state.to_show_error && state.pass?.length == 0
                        ? 'Enter the pass to continue'
                        : ''
                    }
                    onchange={(e) =>
                      setState((prevs) => ({
                        ...prevs,
                        pass: e.target.value
                      }))
                    }
                    post_icon_path={
                      <div
                        onClick={() =>
                          setState((prevs) => ({
                            ...prevs,
                            pass_type:
                              prevs.pass_type == 'text' ? 'password' : 'text'
                          }))
                        }
                        className="transition-transform transform duration-75 active:scale-95"
                      >
                        <CustomText
                          content={'show'}
                          className="mr-2 text-[#909090]"
                          fontsize="8px"
                        />
                      </div>
                    }
                  />
                </div>
                <div className="w-full">
                  <CustomSelect
                    fontSize={'11px'}
                    option_data={['Admin', 'SuperAdmin']}
                    top_title={'Access'}
                    border_color="rgba(110, 118, 132, 0.33)"
                    padding="10px"
                    selectedValue={state.role}
                    onChange={(e) =>
                      setState((prevs) => ({
                        ...prevs,
                        role: e
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mx-28">
                <CustomButton
                  className="mt-3  bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] "
                  text_classname={'text-white'}
                  content={'Create New Admin'}
                  md_round={false}
                  pill_rounded={true}
                  onClick={registerNewAdmin}
                />
              </div>
            </div>
          }
        />
        <CustomModal
          open={state.is_pass_modalopen}
          handleClose={() =>
            setState((prevs) => ({ ...prevs, is_pass_modalopen: false }))
          }
          title={
            <span>
              Change <strong>Password</strong>
            </span>
          }
          description={
            'The "Add New Admin" form allows you to create a new admin account by entering user details and assigning administrative privileges.'
          }
          restContent={
            <div>
              <div className=" mt-6">
                <CustomInput
                  top_title="Name"
                  content="Enter your first name"
                  backgroundColor="white"
                  value={state.name}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      name: e.target.value
                    }))
                  }
                  error_text={
                    state.to_show_error &&
                    state.name?.length == 0 &&
                    'Enter the name to continue'
                  }
                />
              </div>
              <div className="w-full mt-4">
                <CustomInput
                  top_title="New Password"
                  content=""
                  default_input_type={false}
                  set_input_type={state.change_pass_type}
                  backgroundColor="white"
                  value={state.change_pass}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      change_pass: e.target.value
                    }))
                  }
                  post_icon_path={
                    <div
                      onClick={() =>
                        setState((prevs) => ({
                          ...prevs,
                          change_pass_type:
                            prevs.change_pass_type == 'text'
                              ? 'password'
                              : 'text'
                        }))
                      }
                      className="transition-transform transform duration-75 active:scale-95"
                    >
                      <CustomText
                        content={'show'}
                        className="mr-2 text-[#909090]"
                        fontsize="8px"
                      />
                    </div>
                  }
                  error_text={
                    state.to_show_error &&
                    state.change_pass?.length == 0 &&
                    'Enter the password to continue'
                  }
                />
              </div>
              <div className="w-full mt-4">
                <CustomInput
                  top_title="Confirm Password"
                  content=""
                  default_input_type={false}
                  set_input_type={state.confirm_change_pass_type}
                  backgroundColor="white"
                  value={state.confirm_change_pass}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      confirm_change_pass: e.target.value
                    }))
                  }
                  post_icon_path={
                    <div
                      onClick={() =>
                        setState((prevs) => ({
                          ...prevs,
                          confirm_change_pass_type:
                            prevs.confirm_change_pass_type == 'text'
                              ? 'password'
                              : 'text'
                        }))
                      }
                      className="transition-transform transform duration-75 active:scale-95"
                    >
                      <CustomText
                        content={'show'}
                        className="mr-2 text-[#909090]"
                        fontsize="8px"
                      />
                    </div>
                  }
                  error_text={
                    state.to_show_error
                      ? state.change_pass?.length === 0
                        ? 'Enter the password to continue'
                        : state.change_pass !== state.confirm_change_pass
                          ? 'New password and Confirm password should match'
                          : ''
                      : ''
                  }
                />
              </div>
              <div className="flex gap-4 mx-28 mt-4">
                <CustomButton
                  className="mt-3  bg-white border border-black"
                  text_classname={''}
                  text_color="text-black"
                  content={'Reset'}
                  md_round={false}
                  pill_rounded={true}
                  onClick={() => {
                    setState((prevs) => ({
                      ...prevs,
                      name: '',
                      change_pass: '',
                      confirm_change_pass: ''
                    }))
                  }}
                />
                <CustomButton
                  className="mt-3  bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] "
                  text_classname={'text-white'}
                  content={'submit'}
                  md_round={false}
                  pill_rounded={true}
                  onClick={changeAdminPass}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default Admin
