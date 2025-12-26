import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'


import { IoMdMenu } from 'react-icons/io'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomLogo from './CustomLogo'

const options = [
  { Name: 'Explore', NavigateTo: '/categories' },
  { Name: 'Trending', NavigateTo: '/trending' },
  // { Name: 'About Us', NavigateTo: '/about' },
  { Name: 'Customize Trip', NavigateTo: '' }
]


const ITEM_HEIGHT = 48

function MobileMenu({setStateParent}) {
  const navigate = useNavigate()
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handelOnClick = (option) => {
    handleClose()
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="my-10">
        <div onClick={()=>navigate('/')}>
          <CustomLogo className="m-2" />
        </div>
        <hr className="mt-5 bg-black" />
        <List>
          {options.map((option, index) => (
            <ListItem key={option.Name}>
              <ListItemButton
                onClick={() =>
                  option.Name === 'Customize Trip'
                    ? setStateParent((prevState) => ({
                        ...prevState,
                        showForm: true,
                        isToggled: true
                      }))
                    : navigate(option.NavigateTo)
                }
              >
                <ListItemText
                  primary={<p className="text-xl">{option.Name}</p>}
                  className="text-left"
                  fontSize="1.25rem"
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  )

  return (
    <div>
      <IoMdMenu
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={toggleDrawer('right', true)}
        size={30}
      ></IoMdMenu>
      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        {list('right')}
      </Drawer>
    </div>
  )
}

export default MobileMenu
