"use client"

import CustomInput from './CustomInput'
import CustomText from './CustomText'
import SearchIcon from '@/_assets/svgs/logo/SearchIcon'
import ChatIcon from '@/_assets/svgs/logo/Chat'
import NotificationIcon from '@/_assets/svgs/logo/Notification'
import { CgProfile } from 'react-icons/cg'
import { useEffect, useState } from 'react'
import { localStorageHelper } from '../helper/storageHelper'
import CustomModal from './CustomModal'
import CustomInputFile from './CustomInputFile'
import CustomButton from './CustomButton'
import { useDispatch } from 'react-redux'
import { patch } from '../constants/axiosClient'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
// import { setValue } from '../redux/globalSlice'
// import { useNavigate } from 'react-router-dom'
import { useRouter } from 'next/navigation'
import { PAGES } from '../constants/PagesName'
import { ConfirmationDialog, showConfirmationDialog } from './Dialog/ShowConfirmationDialog'
import { setValue } from '@/lib/globalSlice'

export default function AdminTopbar({ topbar_title }) {
  const [state, setState] = useState({
    user_data: null,
    is_pass_modalopen: false,
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
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const router = useRouter()
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
  const handleLogout = async () => {
    // const isConfirmed = await showConfirmationDialog(dispatch)
    const isConfirmed = await  ConfirmationDialog()
    if (isConfirmed) {
      localStorageHelper.removeItem('login_data')
      router.push(PAGES.MAIN)
    }
  }
  useEffect(() => {
    const data = localStorageHelper.getItem('login_data')
    setState((prevs) => ({ ...prevs, user_data: data }))
  }, [])
  const Icons = ({ Logo_path }) => {
    return (
      <div className="relative group flex items-center justify-center">
        <div className="group-hover:bg-iconhovercolor rounded-full p-6 absolute"></div>
        <div className="group-hover:bg-iconhovercolor rounded-full z-10">
          <Logo_path />
        </div>{' '}
      </div>
    )
  }
  return (
    <div className=" flex justify-between flex-wrap sm:flex-nowrap gap-y-6  ">
      <CustomText
        primaryfontsize
        primaryfontweight
        lineHeight="34.37px"
        content={topbar_title}
        className="text-center mb-2 mr-60 text-nowrap"
      />
      {/* <CustomInput
        content="Search"
        input_font="font-nunitoregular400"
        borderRadius="rounded-3xl"
        className="sm:pr-[5rem] md:pr-[25rem] "
        icon_path={
          <div className="flex mb-1 pl-1 pr-1">
            <SearchIcon />
          </div>
        }
      /> */}
      <div className="flex gap-7 justify-around items-center sm:ml-16 mr-72 ">
        {/* <Icons Logo_path={ChatIcon} />
        <Icons Logo_path={NotificationIcon} /> */}
        <div className="relative group cursor-pointer">
          <CgProfile size={30} />
          <div className="z-30 group-hover:block hidden absolute top-5 right-5 bg-white shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
            <div className="text-nowrap text-center mb-2 ">
              <CustomText
                content={state.user_data?.admin?.name}
                primaryfontweight
                fontsize="25px"
              />
            </div>
            <hr className="my-3 " />
            <div
              onClick={() =>
                setState((prevs) => ({
                  ...prevs,
                  selected_admin_id: state.user_data?.admin?.id,
                  is_pass_modalopen: true
                }))
              }
              className="text-nowrap text-center mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
            >
              Change Password
            </div>
            <div
              onClick={() =>handleLogout()}
              className="text-center text-deltetextcolor cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
            >
              Logout
            </div>
          </div>
        </div>

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
              {/* <div className=" mt-6">
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
                />
              </div> */}
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
                      className="transition-transform transform duration-75 active:scale-95 cursor-pointer select-none"
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
                      className="transition-transform transform duration-75 active:scale-95 cursor-pointer select-none"
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
