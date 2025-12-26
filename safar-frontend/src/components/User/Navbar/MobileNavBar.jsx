import React from 'react'
import SearchBar from './SearchBar'

function MobileNavBar({expanded,setExpanded}) {
    
  return (
    <div className="md:hidden sm:hidden flex justify-between items-center ">
      <img
        onClick={() => navigate('/')}
        className="w-20 acpact"
        src={Logo}
        alt="Logo"
      />
      <div className="flex">
        <div className="w-full max-w-2xl">
          <SearchBar
            expanded={expanded}
            setExpanded={setExpanded}
          />
        </div>
      </div>
    </div>
  )
}

export default MobileNavBar