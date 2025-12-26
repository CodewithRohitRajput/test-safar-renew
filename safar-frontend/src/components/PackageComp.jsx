import React, { useState, useEffect } from 'react'
import {
  IconButton,
  TextField,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material'
import { FaPlus, FaMinus } from 'react-icons/fa'
import CustomSelect from './CustomSelect'
import CustomInput from './CustomInput'
import CustomText from './CustomText'
import moment from 'moment'
import BatchManagement from './BatchManagement'


function PackageComp({ state, setState, to_show_error = false }) {
  const [packages, setPackages] = useState(
    state.base_packages || [
      { name: '', original_price: 0, discounted_price: 0 }
    ]
  )

  const [pickupPoints, setPickupPoints] = useState(
    state.pickup_point || [{ name: '', price: 0 }]
  )

  const [dropPoints, setDropPoints] = useState(
    state.drop_point || [{ name: '', price: 0 }]
  )

  const [batches, setBatches] = useState(
    state.batches || [{ start_date: '', end_date: '', is_sold: false, extra_amount: 0, extra_reason: '' }]
  )

  useEffect(() => {
    console.log("PackageComp batches:", batches);
    console.log("PackageComp state.batches:", state.batches);
  }, [batches, state.batches]);
  

  useEffect(() => {
    if (JSON.stringify(state.base_packages) !== JSON.stringify(packages)) {
      setPackages(
        state.base_packages || [
          { name: '', original_price: 0, discounted_price: 0 }
        ]
      )
    }

    if (JSON.stringify(state.pickup_point) !== JSON.stringify(pickupPoints)) {
      setPickupPoints(state.pickup_point || [{ name: '', price: 0 }])
    }

    if (JSON.stringify(state.drop_point) !== JSON.stringify(dropPoints)) {
      setDropPoints(state.drop_point || [{ name: '', price: 0 }])
    }

    if (JSON.stringify(state.batches) !== JSON.stringify(batches)) {
      setBatches(
        state.batches || [{ start_date: '', end_date: '', is_sold: false, extra_amount: 0, extra_reason: '' }]
      )
    }
  }, [state])

  useEffect(() => {
    setState({
      base_packages: packages,
      pickup_point: pickupPoints,
      drop_point: dropPoints,
      batches: batches
    })
  }, [packages, pickupPoints, dropPoints, batches, setState])

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...packages]
    updatedPackages[index][field] = value
    setPackages(updatedPackages)
  }

  const addPackage = () => {
    setPackages([
      ...packages,
      { name: '', original_price: '', discounted_price: '' }
    ])
  }

  const removePackage = (index) => {
    const updatedPackages = packages.filter((_, i) => i !== index)
    setPackages(updatedPackages)
  }

  const handlePickupChange = (index, field, value) => {
    const updatedPickups = [...pickupPoints]
    updatedPickups[index][field] = value
    setPickupPoints(updatedPickups)
  }

  const addPickupPoint = () => {
    setPickupPoints([...pickupPoints, { name: '', price: 0 }])
  }

  const removePickupPoint = (index) => {
    const updatedPickups = pickupPoints.filter((_, i) => i !== index)
    setPickupPoints(updatedPickups)
  }

  const handleDropChange = (index, field, value) => {
    const updatedDrops = [...dropPoints]
    updatedDrops[index][field] = value
    setDropPoints(updatedDrops)
  }

  const addDropPoint = () => {
    setDropPoints([...dropPoints, { name: '', price: 0 }])
  }

  const removeDropPoint = (index) => {
    const updatedDrops = dropPoints.filter((_, i) => i !== index)
    setDropPoints(updatedDrops)
  }



  return (
    <Box>
      {/* Base Package Section */}
      {packages.map((pkg, index) => (
        <Box key={index} sx={{ display: 'flex', mb: 2, gap: 4, mt: 4 }}>
          {/* <TextField
            select
            label="Package Type"
            value={pkg.name}
            onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
          >
            <MenuItem value="Standard Package">Standard Package</MenuItem>
            <MenuItem value="Premium Package">Premium Package</MenuItem>
          </TextField> */}
          <div>
            <CustomSelect
              fontSize={'11px'}
              option_data={['Double Sharing', 'Triple Sharing', 'Quad Sharing', 'Seat in Coach', 'Own on Bike&fuel', 'Dual Rider', 'Solo Rider' , 'Customize Trip 2 Pax','With Flight','Without Flight']}
              top_title={'Package Type'}
              border_color="rgba(110, 118, 132, 0.33)"
              padding="10px"
              selectedValue={pkg.name}
              onChange={(e) => handlePackageChange(index, 'name', e)}
            />
            {to_show_error && pkg.name?.length == 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Please select a package to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>
          {/* <TextField
            label="Base Price"
            value={pkg.original_price}
            onChange={(e) =>
              handlePackageChange(index, 'original_price', e.target.value)
            }
            sx={{ flexGrow: 1, mr: 2 }}
            type="number"
          />
          <TextField
            label=c
            value={pkg.discounted_price}
            onChange={(e) =>
              handlePackageChange(index, 'discounted_price', e.target.value)
            }
            sx={{ flexGrow: 1, mr: 2 }}
            type="number"
          /> */}
          <div>
            <div className="text-start">
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Base Price'}
                className={` mb-3`}
              />
            </div>
            <div className="flex justify-start items-center border border-[#D8D8D8] rounded-md   ">
              <CustomText
                secondaryfontweight
                content={'₹'}
                className="text-[#6E7684] pl-4 "
              />
              <div className="w-[1px] bg-[#D8D8D8] self-stretch ml-5 my-3" />
              <CustomInput
                top_title=""
                set_input_type="number"
                content="Base Price"
                backgroundColor="white"
                border_color="0px solid transparent"
                contentcolor="#6E7684"
                value={pkg.original_price}
                onchange={(e) =>
                  handlePackageChange(index, 'original_price', e.target.value)
                }
              />
            </div>
            {to_show_error && pkg.original_price == 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Enter the Base price to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>
          <div>
            <div className="text-start">
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Discounted Price'}
                className={` mb-3`}
              />
            </div>
            <div className="flex justify-start items-center border border-[#D8D8D8] rounded-md   ">
              <CustomText
                secondaryfontweight
                content={'₹'}
                className="text-[#6E7684] pl-4 "
              />
              <div className="w-[1px] bg-[#D8D8D8] self-stretch ml-5 my-3" />
              <CustomInput
                top_title=""
                content="Discounted Price"
                set_input_type="number"
                backgroundColor="white"
                border_color="0px solid transparent"
                contentcolor="#6E7684"
                value={pkg.discounted_price}
                onchange={(e) =>
                  handlePackageChange(index, 'discounted_price', e.target.value)
                }
              />
            </div>
            {to_show_error && pkg.discounted_price == 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Enter the Discounted price to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>

          <IconButton onClick={addPackage} color="primary">
            <FaPlus />
          </IconButton>
          {packages.length > 1 && (
            <IconButton onClick={() => removePackage(index)} color="secondary">
              <FaMinus />
            </IconButton>
          )}
        </Box>
      ))}

      {/* Pickup Points Section */}
      {pickupPoints.map((pickup, index) => (
        <Box key={index} sx={{ display: 'flex', mb: 2, gap: 4 }}>
          {/* <TextField
            label="Starting Location"
            value={pickup.name}
            onChange={(e) => handlePickupChange(index, 'name', e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
          /> */}
          <CustomInput
            top_title="Starting Location"
            content="Enter starting location"
            backgroundColor="white"
            contentcolor="#6E7684"
            value={pickup.name}
            onchange={(e) => handlePickupChange(index, 'name', e.target.value)}
            error_text={
              to_show_error &&
              pickup.name?.length == 0 &&
              'Enter the starting location to continue'
            }
          />
          {/* <TextField
            label="Travel Price"
            value={pickup.price}
            onChange={(e) => handlePickupChange(index, 'price', e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
            type="number"
          /> */}
          <div>
            <div className="text-start">
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Travel Price'}
                className={` mb-3`}
              />
            </div>
            <div className="flex justify-start items-center border border-[#D8D8D8] rounded-md   ">
              <CustomText
                secondaryfontweight
                content={'₹'}
                className="text-[#6E7684] pl-4 "
              />
              <div className="w-[1px] bg-[#D8D8D8] self-stretch ml-5 my-3" />
              <CustomInput
                top_title=""
                content="Travel price"
                set_input_type="number"
                backgroundColor="white"
                border_color="0px solid transparent"
                contentcolor="#6E7684"
                value={pickup.price}
                onchange={(e) =>
                  handlePickupChange(index, 'price', e.target.value)
                }
              />
            </div>
            {to_show_error && pickup.price < 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Enter the travel price to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>

          <IconButton onClick={addPickupPoint} color="primary">
            <FaPlus />
          </IconButton>
          {pickupPoints.length > 1 && (
            <IconButton
              onClick={() => removePickupPoint(index)}
              color="secondary"
            >
              <FaMinus />
            </IconButton>
          )}
        </Box>
      ))}

      {/* Drop Points Section */}
      {dropPoints.map((drop, index) => (
        <Box key={index} sx={{ display: 'flex', mb: 2, gap: 4 }}>
          {/* <TextField
            label="Drop Location"
            value={drop.name}
            onChange={(e) => handleDropChange(index, 'name', e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
          /> */}
          <CustomInput
            top_title="Drop Location"
            content="Enter drop location"
            backgroundColor="white"
            contentcolor="#6E7684"
            value={drop.name}
            onchange={(e) => handleDropChange(index, 'name', e.target.value)}
            error_text={
              to_show_error &&
              drop.name?.length == 0 &&
              'Enter the drop location to continue'
            }
          />
          {/* <TextField
            label="Drop Price"
            value={drop.price}
            onChange={(e) => handleDropChange(index, 'price', e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
            type="number"
          /> */}
          <div>
            <div className="text-start">
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Drop Price'}
                className={` mb-3`}
              />
            </div>
            <div className="flex justify-start items-center border border-[#D8D8D8] rounded-md   ">
              <CustomText
                secondaryfontweight
                content={'₹'}
                className="text-[#6E7684] pl-4 "
              />
              <div className="w-[1px] bg-[#D8D8D8] self-stretch ml-5 my-3" />
              <CustomInput
                top_title=""
                content="Drop Price"
                set_input_type="number"
                backgroundColor="white"
                border_color="0px solid transparent"
                contentcolor="#6E7684"
                value={drop.price}
                onchange={(e) =>
                  handleDropChange(index, 'price', e.target.value)
                }
              />
            </div>
            {to_show_error && drop.price < 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Enter the drop price to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>
          <IconButton onClick={addDropPoint} color="primary">
            <FaPlus />
          </IconButton>
          {dropPoints.length > 1 && (
            <IconButton
              onClick={() => removeDropPoint(index)}
              color="secondary"
            >
              <FaMinus />
            </IconButton>
          )}
        </Box>
      ))}

      {/* Batch Dates and Is Sold Section */}
      {/* {batches.map((batch, index) => (
        <Box key={index} sx={{ display: 'flex', mb: 2, gap: 4 }}>
          <div className="flex flex-col w-full">
            <div className="text-start">
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Batch Start Date'}
                className={` mb-3`}
              />
            </div>
            <TextField
              value={
                isISODate(batch.start_date)
                  ? new Date(batch.start_date).toISOString().split('T')[0] // If ISO format, format to 'YYYY-MM-DD'
                  : batch.start_date
              }
              onChange={(e) =>
                handleBatchChange(index, 'start_date', e.target.value)
              }
              type="date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: {
                  min: moment().format('YYYY-MM-DD')
                },
                sx: {
                  height: '45px',
                  padding: '0 10px',
                  borderRadius: '8px'
                }
              }}
            />
            {to_show_error && batch.start_date?.length == 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Please add a start date to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="text-start">
              <CustomText
                secondaryfontsize
                secondaryfontweight
                content={'Batch End Date'}
                className={` mb-3`}
              />
            </div>
            <TextField
              value={
                isISODate(batch.end_date)
                  ? new Date(batch.end_date).toISOString().split('T')[0] // If ISO format, format to 'YYYY-MM-DD'
                  : batch.end_date
              }
              onChange={(e) =>
                handleBatchChange(index, 'end_date', e.target.value)
              }
              type="date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: {
                  min: moment().format('YYYY-MM-DD')
                },
                sx: {
                  height: '45px',
                  padding: '0 10px',
                  borderRadius: '8px'
                }
              }}
            />
            {to_show_error && batch.end_date?.length == 0 && (
              <div className="flex justify-start my-2">
                <CustomText
                  content={'Please add a end date to continue'}
                  className="text-red-500"
                  fontsize="12px"
                />
              </div>
            )}
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={batch.is_sold}
                onChange={(e) =>
                  handleBatchChange(index, 'is_sold', e.target.checked)
                }
              />
            }
            label="Is Sold"
            sx={{ marginTop: '25px' }}
          />
          <IconButton onClick={addBatch} color="primary">
            <FaPlus />
          </IconButton>
          {batches.length > 1 && (
            <IconButton onClick={() => removeBatch(index)} color="secondary">
              <FaMinus />
            </IconButton>
          )}
        </Box>
      ))} */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Batch Management
      </Typography>
      <BatchManagement 
        batches={batches}
        setBatches={setBatches}
        to_show_error={to_show_error}
      />
    </Box>
  )
}

export default PackageComp
