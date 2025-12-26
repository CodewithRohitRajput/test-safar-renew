import React from 'react'
import CustomText from './CustomText'

function PaginationComp({
  total_pages = 1,
  current_page,
  prevonClick,
  nextonClick,
  onClick
}) {
  return (
    <div>
      <div className="flex gap-2 mb-3 mt-3">
        <div>
          <div
            onClick={prevonClick}
            className="transition-transform transform duration-75 active:scale-95 p-2 px-[0.7rem] select-none  rounded-md"
          >
            <CustomText content={'Prev'} className="text-black" />
          </div>
        </div>
        {Array.from({ length: total_pages }, (v, i) => i + 1)?.map(
          (item, index) => (
            <React.Fragment key={item || index}>
              {(current_page == item ||
                current_page + 1 == item ||
                current_page - 1 == item) && (
                <div>
                  <div
                    onClick={(e) => onClick(item)}
                    className={`transition-transform transform duration-75 active:scale-95 p-2 px-[0.7rem] select-none ${
                      current_page == item ? 'bg-[#3E4947]' : 'bg-white'
                    } ${
                      current_page != item && 'border-2 border-[#F1F1F1]'
                    } rounded-md `}
                  >
                    <CustomText
                      content={item}
                      className={`${
                        current_page == item ? 'text-white' : 'text-black'
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        )}
        <div>
          <div
            onClick={nextonClick}
            className="transition-transform transform duration-75 active:scale-95 p-2 px-[0.7rem] select-none rounded-md"
          >
            <CustomText content={'Next'} className="text-black" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginationComp
