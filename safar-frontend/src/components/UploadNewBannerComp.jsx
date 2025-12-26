import React, { useRef } from 'react'
import CustomModal from './CustomModal'
import { setValue } from '@/lib/globalSlice'
import { get, post } from '../constants/axiosClient'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import { localStorageHelper } from '../helper/storageHelper'
import { PAGES } from '../constants/PagesName'
import CustomText from './CustomText'
import CustomInput from './CustomInput'
import CustomSelect from './CustomSelect'
import CustomInputFile from './CustomInputFile'
import moment from 'moment'
import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { useRouter } from 'next/navigation'
import CustomButton from './CustomButton'

function UploadNewBannerComp({
  state,
  setState,
  to_fetch_after_banner_upload = false,
  Fetch_content_after_banner_upload = () => {}
}) {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const router = useRouter()
  const dateref = useRef()
  const getAllCategories = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      await get(API_ENDPOINTS.COMMON.GET_ALL_CATEGORIES).then((d) => {
        if (d.message == 'CATEGORIES_FETCHED' && d.success == true) {
          dispatch(setValue({ key: 'to_show_loader', value: false }))
          setState((prevs) => ({
            ...prevs,
            categories_data: d?.data?.categories,
            categories_list: d?.data?.categories?.map(
              (category) => category?.name
            )
          }))
          console.log(
            'logging data from cat list',
            d?.data?.categories?.map((category) => category?.name)
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
  const postOfferBanner = async () => {
    dispatch(setValue({ key: 'to_show_loader', value: true }))
    try {
      const data = {
        title: state.banner_title,
        image: state.banner_img_url,
        expire_at: state.banner_date
          ? moment(state.banner_date)
              .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
              .toString()
          : '',
        category_id: state.selected_category?.id,
        route_map: state.banner_route_map,
        category_name: state.banner_category_name
      }
      if (
        state.selected_category?.id == undefined ||
        state.banner_title?.length == 0 ||
        state.banner_img_url?.length == 0 ||
        state.banner_date?.length == 0
      ) {
        setState((prevs) => ({ ...prevs, to_show_error: true }))
        dispatch(setValue({ key: 'to_show_loader', value: false }))
        return
      }
      console.log('loggin data to send', data)
      await post(API_ENDPOINTS.ADMIN.POST_OFFER_BANNER, data).then((d) => {
        if (d.message == 'BANNER_ADDED' && d.success == true) {
          dispatch(
            setValue({
              key: 'to_show_loader',
              value: false
            })
          ),
            setState((prevs) => ({ ...prevs, upload_modal: false })),
            dispatch(
              setValue({
                key: 'to_show_alert',
                value: true
              })
            ),
            dispatch(
              setValue({
                key: 'alert_content',
                value: 'Banner Added Successfully'
              })
            )
          if (to_fetch_after_banner_upload == true) {
            Fetch_content_after_banner_upload()
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
  return (
    <div>
      <CustomModal
        title={''}
        description={''}
        open={state.upload_modal}
        backdropvalue="0.1"
        restContent={
          <div>
            <div className="flex justify-center items-center mb-12">
              <CustomText content={'Upload'} fontsize="34px" />
              <CustomText
                primaryfontweight
                content={'Offer Banner'}
                fontsize="34px"
                className="pl-2"
              />
            </div>
            <CustomInput
              top_title="Banner Name"
              backgroundColor="white"
              content="Enter name of Itinerary"
              onchange={(e) =>
                setState((prevs) => ({
                  ...prevs,
                  banner_title: e.target.value
                }))
              }
              error_text={
                state.to_show_error &&
                state.banner_title?.length == 0 &&
                'Enter the name of itinerary to continue'
              }
            />

            <div className="flex gap-4 mt-4">
              <div>
                <CustomSelect
                  top_title={'Choose Category'}
                  option_data={['Choose Category', ...state.categories_data]}
                  border_color="rgba(110, 118, 132, 0.33)"
                  onOpen={() =>
                    state.categories_list?.length == 0
                      ? getAllCategories()
                      : null
                  }
                  content_destruct={(item) => (
                    <CustomText
                      content={item && item?.name ? item?.name : item}
                    />
                  )}
                  selectedValue={state.selected_category}
                  onChange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      selected_category: e,
                      itinerary_list:
                        e?.itinerary?.length > 0 ? e?.itinerary : '',
                      banner_route_map: e.route_map,
                      banner_category_name: e.name
                    }))
                  }
                />
                {state.to_show_error &&
                  state.selected_category?.id == undefined && (
                    <div className="flex justify-start my-2">
                      <CustomText
                        content={'Please add a category to continue'}
                        className="text-red-500"
                        fontsize="12px"
                      />
                    </div>
                  )}
              </div>
              {/* <div>
                <CustomSelect
                  top_title={'Choose itinerary'}
                  option_data={['Choose itinerary', ...state.itinerary_list]}
                  border_color="rgba(110, 118, 132, 0.33)"
                  // onOpen={() => {
                  //   state.categories_list?.length > 1 && getItineraryById()
                  // }}
                  content_destruct={(item) => (
                    <CustomText content={item?.id ? item?.title : item} />
                  )}
                  selectedValue={state.selected_itinerary}
                  onChange={(e) =>
                    setState((prevs) => ({ ...prevs, selected_itinerary: e }))
                  }
                />
                {state.to_show_error &&
                  state.selected_itinerary?.id == undefined && (
                    <div className="flex justify-start my-2">
                      <CustomText
                        content={'Please add a itinerary to continue'}
                        className="text-red-500"
                        fontsize="12px"
                      />
                    </div>
                  )}
              </div> */}
            </div>
            <CustomInputFile
              btncontent="Browse..."
              second_title_btn="Or drop Banner Image here"
              top_title_content="Banner Image :"
              className={'mt-6'}
              no_right_margin={true}
              small_btn={true}
              state={state.banner_img_url}
              inputId="bannerimg_input"
              setstate={(e) =>
                setState((prevs) => ({ ...prevs, banner_img_url: e }))
              }
              to_compressImage={false}
              convertimgtype="image/webp"
            />
            {state.to_show_error && state.banner_img_url?.length == 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Please add a image to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
            <div>
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Duration'}
                className={`mb-3 mt-4 flex self-start`}
              />
              <div className="flex justify-start items-center border border-[#6E7684] rounded-md mt-4 p-2">
                <CustomText
                  secondaryfontweight
                  content={'Expired At'}
                  className="text-[#6E7684] "
                />
                <div className="w-[1px] bg-[#6E7684] self-stretch ml-5" />
                <CustomInput
                  content="dd/mm/yy"
                  backgroundColor="white"
                  border_color="0px solid transparent"
                  contentcolor="#6E7684"
                  value={state.banner_date}
                  onClick={() => dateref.current.showPicker()}
                  onchange={() => null}
                />
              </div>
              {state.to_show_error && state.banner_date?.length == 0 && (
                <div className="flex justify-start my-2">
                  <CustomText
                    content={'Enter a date to continue'}
                    className="text-red-500"
                    fontsize="12px"
                  />
                </div>
              )}
            </div>
            <input
              ref={dateref}
              type={'datetime-local'}
              min={moment().format('YYYY-MM-DDTHH:mm')}
              style={{
                visibility: 'hidden',
                position: 'absolute',
                zIndex: -1
              }}
              placeholder={'dd/mm/yy'}
              onChange={(e) => {
                setState((prevs) => ({
                  ...prevs,
                  banner_date: e.target.value
                }))
                console.log('logging from onchange ', e.target.value)
              }}
            />
            <div className="mx-10 mt-6 ">
              <CustomButton
                className="mt-3 bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] "
                text_classname={'text-white'}
                content={'Finish'}
                md_round={false}
                pill_rounded={true}
                onClick={postOfferBanner}
              />
            </div>
          </div>
        }
        handleClose={() =>
          setState((prevs) => ({
            ...prevs,
            upload_modal: false
          }))
        }
      />
    </div>
  )
}

export default UploadNewBannerComp
