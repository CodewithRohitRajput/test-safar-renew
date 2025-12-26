// "use client"

// import React, { useEffect, useState } from 'react'
// import AdminBackground from '@/_assets/svgs/AdminBackground.svg'
// import '../../index.css'
// import CustomText from '../../components/CustomText'
// import CustomInput from '../../components/CustomInput'
// import { light } from '@/_assets/themes/themes'
// import CustomCheckboxWithLabel from '../../components/CustomCheckboxWithLabel'
// import CustomButton from '../../components/CustomButton'
// import { get, post } from '../../constants/axiosClient'
// import { API_ENDPOINTS } from '../../constants/apiEndpoints'
// // import { Navigate, useNavigate } from 'react-router-dom'
// import { Navigate, useNavigate } from 'react-router-dom'
// import { PAGES } from '../../constants/PagesName'
// import { useDispatch } from 'react-redux'
// import { setValue } from '@/lib/globalSlice'
// import { localStorageHelper } from '../../helper/storageHelper'
// import { IconButton } from '@mui/material'
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

// function Login() {
//   const [state, setstate] = useState({
//     email: '',
//     password: '',
//     pass_input_type: 'password'
//   })
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   useEffect(() => {
//     const data = localStorageHelper.getItem('login_data')
//     if (data != null) {
//       navigate(PAGES.DASHBOARD)
//     }
//   }, [])
//   const login_to_account = async () => {
//     dispatch(setValue({ key: 'to_show_loader', value: true }))
//     const data_to_send = {
//       email: state.email,
//       password: state.password
//     }
//     try {
//       await post(API_ENDPOINTS.ADMIN.AUTHENTICATE_USER, data_to_send).then(
//         (d) => {
//           if (d.message === 'ADMIN_LOGGED_IN') {
//             localStorageHelper.setItem('login_data', d.data)
//             setTimeout(() => {
//               navigate(PAGES.DASHBOARD, { replace: true })
//               dispatch(setValue({ key: 'to_show_loader', value: false }))
//               dispatch(setValue({ key: 'alert_type', value: 'success' }))
//             }, 1000)
//           }
//           // console.log('msg', d.message)
//         }
//       )
//     } catch (error) {
//       dispatch(setValue({ key: 'alert_type', value: 'warning' }))
//       dispatch(
//         setValue({
//           key: 'to_show_alert',
//           value: true
//         })
//       )
//       dispatch(
//         setValue({
//           key: 'alert_content',
//           value: error?.response?.data?.message
//         })
//       )
//       dispatch(setValue({ key: 'to_show_loader', value: false }))
//       console.error(error)
//     }
//   }
//   return (
//     <div
//       className=" h-screen w-full flex items-center justify-center "
//       // style={{ backgroundImage: `url(${AdminBackground})` }}
//     >
//       <img
//         src={AdminBackground}
//         alt="bg image"
//         className="h-screen w-screen absolute object-cover z-[-1] "
//       />
//       <div className=" bg-white p-16 rounded-2xl animate-fadeIn">
//         <CustomText
//           primaryfontsize
//           primaryfontweight
//           lineHeight="34.37px"
//           content={'Login to Account'}
//           className="text-center mb-2 "
//         />
//         <CustomText
//           secondaryfontsize
//           secondaryfontweight
//           content={'Please enter your email and password to continue'}
//           className="text-center mb-8 opacity-80"
//         />
//         <CustomInput
//           top_title="Email Address"
//           content="esteban_schiller@gmail.com"
//           btnparentclassname={'mb-8'}
//           value={state.email}
//           onchange={(e) =>
//             setstate((prevs) => ({ ...prevs, email: e.target.value }))
//           }
//         />
//         <CustomInput
//           top_title="Password"
//           top_title_classname={'opacity-80'}
//           second_top_title_classname={'opacity-60'}
//           second_top_title="Forgot Password?"
//           content="test_password"
//           btnparentclassname={'mb-2'}
//           default_input_type={false}
//           set_input_type={state.pass_input_type}
//           value={state.password}
//           onchange={(e) =>
//             setstate((prevs) => ({ ...prevs, password: e.target.value }))
//           }
//           post_icon_path={
//             <IconButton
//               onClick={() => {
//                 setstate((prevs) => ({
//                   ...prevs,
//                   pass_input_type:
//                     prevs.pass_input_type == 'text' ? 'password' : 'text'
//                 }))
//               }}
//             >
//               {state.pass_input_type == 'password' ? (
//                 <FaRegEye size={30} />
//               ) : (
//                 <FaRegEyeSlash />
//               )}
//             </IconButton>
//           }
//         />
//         <CustomCheckboxWithLabel
//           className={'mb-8'}
//           content={'Remember Password'}
//         />
//         <div className="mx-4">
//           <CustomButton
//             content={'Sign In'}
//             btncolor={light.signinbtnbackground}
//             // className="mr-10"
//             onClick={login_to_account}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


'use client' // ✅ Required in Next.js app directory for components using hooks

import React, { useEffect, useState } from 'react'

// ✅ Changed from useNavigate (react-router-dom) to useRouter (next/navigation)
import { useRouter } from 'next/navigation'

// ✅ Next.js requires `next/image` for optimized images
import Image from 'next/image'

import AdminBackground from '@/_assets/svgs/AdminBackground.svg'

import CustomText from '@/components/CustomText'
import CustomInput from '@/components/CustomInput'
import CustomCheckboxWithLabel from '@/components/CustomCheckboxWithLabel'
import CustomButton from '@/components/CustomButton'

import { light } from '@/_assets/themes/themes'
import { post } from '@/constants/axiosClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { PAGES } from '@/constants/PagesName'

import { useDispatch } from 'react-redux'
import { setValue } from '@/lib/globalSlice'
import { localStorageHelper } from '@/helper/storageHelper'

import { IconButton } from '@mui/material'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import useAuthRedirect from '@/hooks/useAuthRedirect'

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    pass_input_type: 'password'
  })

  // ✅ Replaced useNavigate with useRouter
  const router = useRouter()
  const dispatch = useDispatch()

  // useEffect(() => {
  //   console.log("Wapas a gaya")
  //   const data = localStorageHelper.getItem('login_data')
  //   if (data !== null) {
      
  //     router.replace(PAGES.DASHBOARD)
  //   }
  // }, [])
  useAuthRedirect();

  const loginToAccount = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    const dataToSend = {
      email: state.email,
      password: state.password
    }

    try {
      const d = await post(API_ENDPOINTS.ADMIN.AUTHENTICATE_USER, dataToSend)
     
      if (d.message === 'ADMIN_LOGGED_IN') {
        localStorageHelper.setItem('login_data', d.data)
        setTimeout(() => {
          // ✅ Replaced navigate with router.replace
          router.replace(PAGES.DASHBOARD)
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          dispatch(setValue({ key: 'alert_type', value: 'success' }))
        }, 3000)
      }
    } catch (error) {
      dispatch(setValue({ key: 'alert_type', value: 'warning' }))
      dispatch(setValue({ key: 'to_show_alert', value: true }))
      dispatch(
        setValue({
          key: 'alert_content',
          value: error?.response?.data?.message
        })
      )
      dispatch(setValue({ key: 'to_show_loader', value: false }))
      console.error(error)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      {/* ✅ Replaced <img> with Next.js <Image /> component for optimization */}
      <Image
        src={AdminBackground}
        alt="bg image"
        fill
        className="object-cover z-[-1]"
        priority
      />
      <div className="bg-white p-16 rounded-2xl animate-fadeIn">
        <CustomText
          primaryfontsize
          primaryfontweight
          lineHeight="34.37px"
          content="Login to Account"
          className="text-center mb-2"
        />
        <CustomText
          secondaryfontsize
          secondaryfontweight
          content="Please enter your email and password to continue"
          className="text-center mb-8 opacity-80"
        />
        <CustomInput
          top_title="Email Address"
          content="esteban_schiller@gmail.com"
          btnparentclassname="mb-8"
          value={state.email}
          onchange={(e) =>
            setState((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <CustomInput
          top_title="Password"
          top_title_classname="opacity-80"
          second_top_title_classname="opacity-60"
          second_top_title="Forgot Password?"
          content="test_password"
          btnparentclassname="mb-2"
          default_input_type={false}
          set_input_type={state.pass_input_type}
          value={state.password}
          onchange={(e) =>
            setState((prev) => ({ ...prev, password: e.target.value }))
          }
          post_icon_path={
            <IconButton
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  pass_input_type:
                    prev.pass_input_type === 'text' ? 'password' : 'text'
                }))
              }
            >
              {state.pass_input_type === 'password' ? (
                <FaRegEye size={30} />
              ) : (
                <FaRegEyeSlash />
              )}
            </IconButton>
          }
        />
        <CustomCheckboxWithLabel
          className="mb-8"
          content="Remember Password"
        />
        <div className="mx-4">
          <CustomButton
            content="Sign In"
            btncolor={light.signinbtnbackground}
            onClick={loginToAccount}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
