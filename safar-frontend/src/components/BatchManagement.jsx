"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Dialog,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Calendar } from "react-multi-date-picker";
import CustomSelect from "./CustomSelect";
// import moment from 'moment'
import CustomText from "./CustomText";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import BulkEditDialog from "./BulkEditDialog";
import moment from "moment-timezone";
import BatchCalendarView from "./BatchCalendarView";

// Move BulkEditDialog to a separate component
// const BulkEditDialog = ({
//   open,
//   onClose,
//   bulkEditConfig,
//   setBulkEditConfig,
//   onApply
// }) => {
//   const daysOfWeek = [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday'
//   ]
//   const months = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December'
//   ]
//   const years = Array.from({ length: 5 }, (_, i) => moment().year() + i)
//   const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1)

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: '12px',
//           maxHeight: '90vh'
//         }
//       }}
//     >
//       <Box
//         sx={{
//           p: 4,
//           backgroundColor: '#f8f9fa'
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mb: 3
//           }}
//         >
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 600,
//               color: '#1a1a1a'
//             }}
//           >
//             Bulk Edit Batches
//           </Typography>
//           <IconButton onClick={onClose}>
//             <IoClose size={24} />
//           </IconButton>
//         </Box>

//         {/* Date Range */}
//         <Box
//           sx={{
//             mb: 4,
//             p: 3,
//             backgroundColor: 'white',
//             borderRadius: '8px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
//             Date Range
//           </Typography>
//           <Box
//             sx={{
//               display: 'flex',
//               gap: 3,
//               flexWrap: 'wrap'
//             }}
//           >
//             <TextField
//               type="date"
//               label="Start Date"
//               value={bulkEditConfig.dateRange.startDate}
//               onChange={(e) =>
//                 setBulkEditConfig((prev) => ({
//                   ...prev,
//                   dateRange: { ...prev.dateRange, startDate: e.target.value }
//                 }))
//               }
//               sx={{
//                 minWidth: '200px',
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '8px'
//                 }
//               }}
//             />
//             <TextField
//               type="date"
//               label="End Date"
//               value={bulkEditConfig.dateRange.endDate}
//               onChange={(e) =>
//                 setBulkEditConfig((prev) => ({
//                   ...prev,
//                   dateRange: { ...prev.dateRange, endDate: e.target.value }
//                 }))
//               }
//               sx={{
//                 minWidth: '200px',
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '8px'
//                 }
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Grid Layout for Selections */}
//         <Box
//           sx={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//             gap: 3,
//             mb: 4
//           }}
//         >
//           {/* Days of Week */}
//           <Box
//             sx={{
//               p: 3,
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
//               Days of Week
//             </Typography>
//             <Box
//               sx={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
//                 gap: 1
//               }}
//             >
//               {daysOfWeek.map((day, index) => (
//                 <FormControlLabel
//                   key={day}
//                   control={
//                     <Checkbox
//                       checked={bulkEditConfig.daysOfWeek.includes(index)}
//                       onChange={(e) => {
//                         setBulkEditConfig((prev) => ({
//                           ...prev,
//                           daysOfWeek: e.target.checked
//                             ? [...prev.daysOfWeek, index]
//                             : prev.daysOfWeek.filter((d) => d !== index)
//                         }))
//                       }}
//                       sx={{
//                         color: '#3f51b5',
//                         '&.Mui-checked': {
//                           color: '#3f51b5'
//                         }
//                       }}
//                     />
//                   }
//                   label={day}
//                   sx={{
//                     '& .MuiFormControlLabel-label': {
//                       fontSize: '0.9rem',
//                       color: '#4a5568'
//                     }
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>

//           {/* Months */}
//           <Box
//             sx={{
//               p: 3,
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
//               Months
//             </Typography>
//             <Box
//               sx={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
//                 gap: 1
//               }}
//             >
//               {months.map((month, index) => (
//                 <FormControlLabel
//                   key={month}
//                   control={
//                     <Checkbox
//                       checked={bulkEditConfig.months.includes(index)}
//                       onChange={(e) => {
//                         setBulkEditConfig((prev) => ({
//                           ...prev,
//                           months: e.target.checked
//                             ? [...prev.months, index]
//                             : prev.months.filter((m) => m !== index)
//                         }))
//                       }}
//                       sx={{
//                         color: '#3f51b5',
//                         '&.Mui-checked': {
//                           color: '#3f51b5'
//                         }
//                       }}
//                     />
//                   }
//                   label={month}
//                   sx={{
//                     '& .MuiFormControlLabel-label': {
//                       fontSize: '0.9rem',
//                       color: '#4a5568'
//                     }
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>

//           {/* Days of Month */}
//           <Box
//             sx={{
//               p: 3,
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
//               Days of Month
//             </Typography>
//             <Box
//               sx={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
//                 gap: 1,
//                 maxHeight: '200px',
//                 overflowY: 'auto',
//                 pr: 1
//               }}
//             >
//               {daysOfMonth.map((day) => (
//                 <FormControlLabel
//                   key={day}
//                   control={
//                     <Checkbox
//                       checked={bulkEditConfig.daysOfMonth.includes(day)}
//                       onChange={(e) => {
//                         setBulkEditConfig((prev) => ({
//                           ...prev,
//                           daysOfMonth: e.target.checked
//                             ? [...prev.daysOfMonth, day]
//                             : prev.daysOfMonth.filter((d) => d !== day)
//                         }))
//                       }}
//                       sx={{
//                         color: '#3f51b5',
//                         '&.Mui-checked': {
//                           color: '#3f51b5'
//                         }
//                       }}
//                     />
//                   }
//                   label={day}
//                   sx={{
//                     '& .MuiFormControlLabel-label': {
//                       fontSize: '0.9rem',
//                       color: '#4a5568'
//                     }
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>

//           {/* Years */}
//           <Box
//             sx={{
//               p: 3,
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
//               Years
//             </Typography>
//             <Box
//               sx={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
//                 gap: 1
//               }}
//             >
//               {years.map((year) => (
//                 <FormControlLabel
//                   key={year}
//                   control={
//                     <Checkbox
//                       checked={bulkEditConfig.years.includes(year)}
//                       onChange={(e) => {
//                         setBulkEditConfig((prev) => ({
//                           ...prev,
//                           years: e.target.checked
//                             ? [...prev.years, year]
//                             : prev.years.filter((y) => y !== year)
//                         }))
//                       }}
//                       sx={{
//                         color: '#3f51b5',
//                         '&.Mui-checked': {
//                           color: '#3f51b5'
//                         }
//                       }}
//                     />
//                   }
//                   label={year}
//                   sx={{
//                     '& .MuiFormControlLabel-label': {
//                       fontSize: '0.9rem',
//                       color: '#4a5568'
//                     }
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>
//         </Box>

//         <Button
//           variant="contained"
//           onClick={onApply}
//           fullWidth
//           sx={{
//             py: 1.5,
//             borderRadius: '8px',
//             backgroundColor: '#3f51b5',
//             '&:hover': {
//               backgroundColor: '#2c387e'
//             },
//             textTransform: 'none',
//             fontSize: '1rem'
//           }}
//         >
//           Apply Bulk Edit
//         </Button>
//       </Box>
//     </Dialog>
//   )
// }

// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormControl,
//   FormControlLabel,
//   RadioGroup,
//   Radio,
//   Dialog,
//   Chip,
//   Checkbox,
//   Select,
//   MenuItem
// } from '@mui/material'
// import { Calendar } from "react-multi-date-picker"
// import CustomSelect from './CustomSelect'
// import moment from 'moment'
// import CustomText from './CustomText'

function BatchManagement({ batches, setBatches, to_show_error = false }) {
  const [patternType, setPatternType] = useState("custom"); // custom, weekly, monthly
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const [showCalendarView, setShowCalendarView] = useState(false);

  // Add helper function to format dates for calendar
  // const getCalendarHighlights = () => {
  //   return batches.map(batch => ({
  //     date: moment(batch.start_date).format('YYYY-MM-DD'),
  //     className: batch.is_sold ? 'sold-out-date' : 'available-date'
  //   }))
  // }

  const [bulkEditConfig, setBulkEditConfig] = useState({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    is_sold: false,
  });

  const [batchConfig, setBatchConfig] = useState({
    frequency: "weekly",
    startDate: null,
    endDate: null,
    tripDuration: 3,
    capacity: 20,
  });

  console.log(bulkEditConfig, "bulkEditConfig");

  const formatDate = (date) =>
    moment(date).format("YYYY-MM-DD[T]18:30:00.000[Z]");

  const addBatch = () => {
    const today = formatDate(new Date());
    const tomorrow = formatDate(moment().add(1, "days"));

    setBatches((prevBatches) => {
      // Check if a batch with this start_date already exists
      const batchExists = prevBatches.some(
        (batch) => batch.start_date === today
      );

      if (batchExists) {
        return prevBatches; // Don't add if duplicate
      }

      return [
        ...prevBatches,
        {
          start_date: today,
          end_date: tomorrow,
          is_sold: false,
          extra_amount: 0,
          extra_reason: "",
        },
      ];
    });
  };

  // Add useEffect to monitor batches changes
  useEffect(() => {
    console.log("Batches updated:", batches);
  }, [batches]);

  const handleAddBatches = (newBatches) => {
    setBatches((prevBatches) => {
      // Combine existing and new batches
      const combinedBatches = [...prevBatches, ...newBatches];

      // Remove duplicates by start_date
      const uniqueBatches = Object.values(
        combinedBatches.reduce((acc, batch) => {
          // Use start_date as key to identify duplicates
          const key = batch.start_date;
          // Keep the first occurrence of each start_date
          if (!acc[key]) {
            acc[key] = batch;
          }
          return acc;
        }, {})
      );

      return uniqueBatches;
    });
  };

  const formatDateForDisplay = (date) => {
    return moment(date).utc().format("YYYY-MM-DD");
  };

  const formatDateForStorage = (date) => {
    return moment(date).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  };

  // Update handleBatchChange
  const handleBatchChange = (index, field, value) => {
    setBatches((prevBatches) => {
      const updatedBatches = [...prevBatches];
      if (field === "start_date" || field === "end_date") {
        updatedBatches[index][field] = formatDateForStorage(value);
      } else {
        updatedBatches[index][field] = value;
      }
      return updatedBatches;
    });
  };

  const removeBatch = (index) => {
    const updatedBatches = batches.filter((_, i) => i !== index);
    setBatches(updatedBatches);
  };

  // const handleBulkEdit = () => {
  //   const updatedBatches = batches.map(batch => {
  //     const batchDate = moment(batch.start_date);
  //     const isInDateRange = batchDate.isBetween(
  //       bulkEditConfig.dateRange.startDate,
  //       bulkEditConfig.dateRange.endDate,
  //       'day',
  //       '[]'
  //     );

  //     const matchesDayOfWeek = bulkEditConfig.daysOfWeek.length === 0 ||
  //       bulkEditConfig.daysOfWeek.includes(batchDate.day());

  //     const matchesDayOfMonth = bulkEditConfig.daysOfMonth.length === 0 ||
  //       bulkEditConfig.daysOfMonth.includes(batchDate.date());

  //     const matchesMonth = bulkEditConfig.months.length === 0 ||
  //       bulkEditConfig.months.includes(batchDate.month());

  //     const matchesYear = bulkEditConfig.years.length === 0 ||
  //       bulkEditConfig.years.includes(batchDate.year());

  //     if (isInDateRange && matchesDayOfWeek && matchesDayOfMonth && matchesMonth && matchesYear) {
  //       return {
  //         ...batch,
  //         is_sold: bulkEditConfig.is_sold
  //       };
  //     }
  //     return batch;
  //   });

  //   setBatches(updatedBatches);
  //   setShowBulkEdit(false);
  // };

  const handleBulkEdit = () => {
    const { startDate, endDate } = bulkEditConfig.dateRange;
    if (!startDate || !endDate) {
      console.log("Date range not selected");
      return;
    }

    setBatches((prevBatches) =>
      prevBatches.map((batch) => {
        const batchDate = moment(batch.start_date);
        const start = moment(startDate);
        const end = moment(endDate);

        if (batchDate.isBetween(start, end, "day", "[]")) {
          return {
            ...batch,
            is_sold: !batch.is_sold,
          };
        }
        return batch;
      })
    );

    setShowBulkEdit(false);
  };

  const generateBatches = () => {
    let newBatches = [];
    const start = moment(batchConfig.startDate);
    const end = moment(batchConfig.endDate);

    while (start.isBefore(end)) {
      newBatches.push({
        start_date: formatDateForStorage(start),
        end_date: formatDateForStorage(
          start.clone().add(batchConfig.tripDuration, "days")
        )
          .clone()
          .add(batchConfig.tripDuration, "days")
          .format("YYYY-MM-DD"),
        is_sold: false,
        capacity: batchConfig.capacity,
        booked: 0,
      });

      if (batchConfig.frequency === "weekly") {
        start.add(7, "days");
      } else if (batchConfig.frequency === "monthly") {
        start.add(1, "month");
      }
    }

    setBatches(newBatches);
  };

  // const handleBatchChange = (index, field, value) => {
  //   const updatedBatches = [...batches]
  //   updatedBatches[index][field] = value
  //   setBatches(updatedBatches)
  // }

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = moment(startDate);
    const lastDate = moment(endDate);

    while (currentDate.isSameOrBefore(lastDate, "day")) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "days");
    }

    return dates;
  };

  // Update the getCalendarHighlights function
  const getCalendarHighlights = () => {
    const allDates = new Set();
    batches.forEach((batch) => {
      const dateRange = getDatesBetween(batch.start_date, batch.end_date);
      dateRange.forEach((date) => {
        allDates.add({
          date,
          className: batch.is_sold ? "sold-out-date" : "available-date",
          isStart: date === moment(batch.start_date).format("YYYY-MM-DD"),
          isEnd: date === moment(batch.end_date).format("YYYY-MM-DD"),
        });
      });
    });
    return Array.from(allDates);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        p: 3,
      }}
    >
      {/* Header Actions */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          Batch Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setShowBulkEdit(true)}
            sx={{
              bgcolor: "#f97316",
              px: 3,
              py: 1,
              borderRadius: "0.5rem",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#ea580c",
              },
            }}
          >
            Bulk Edit Availability
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowCalendarView(!showCalendarView)}
            sx={{
              borderColor: "#f97316",
              color: "#f97316",
              px: 3,
              py: 1,
              borderRadius: "0.5rem",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#ea580c",
                color: "#ea580c",
                bgcolor: "#fff7ed",
              },
            }}
          >
            {showCalendarView ? "Show List View" : "Show Calendar View"}
          </Button>
        </Box>
      </Box>

      {showCalendarView ? (
        <BatchCalendarView batches={batches} />
      ) : (
        /* List View */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {batches.map((batch, index) => (
            <Box
              key={index}
              sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
            >
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                {/* Start Date */}
                <TextField
                  label="Start Date"
                  type="date"
                  value={
                    batch.start_date
                      ? moment(batch.start_date).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const newBatches = [...batches];
                    newBatches[index].start_date = e.target.value;
                    setBatches(newBatches);
                  }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ minWidth: 200 }}
                />

                {/* End Date */}
                <TextField
                  label="End Date"
                  type="date"
                  value={
                    batch.end_date
                      ? moment(batch.end_date).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const newBatches = [...batches];
                    newBatches[index].end_date = e.target.value;
                    setBatches(newBatches);
                  }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ minWidth: 200 }}
                />

                {/* Extra Amount Field */}
                <TextField
                  label="Extra Amount (₹)"
                  type="number"
                  value={batch.extra_amount || 0}
                  onChange={(e) => {
                    const newBatches = [...batches];
                    newBatches[index].extra_amount =
                      parseInt(e.target.value) || 0;
                    setBatches(newBatches);
                  }}
                  size="small"
                  sx={{ minWidth: 150 }}
                  helperText="Additional amount for this batch"
                />

                {/* Extra Reason Field - ADD THIS */}
                <TextField
                  label="Reason for Extra Amount"
                  value={batch.extra_reason || ""}
                  onChange={(e) => {
                    const newBatches = [...batches];
                    newBatches[index].extra_reason = e.target.value;
                    setBatches(newBatches);
                  }}
                  size="small"
                  sx={{ minWidth: 200 }}
                  placeholder="e.g., Peak Season, Festival, Special Event"
                  helperText="Reason for the extra amount"
                />

                {/* Sold Out Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={batch.is_sold}
                      onChange={(e) => {
                        const newBatches = [...batches];
                        newBatches[index].is_sold = e.target.checked;
                        setBatches(newBatches);
                      }}
                    />
                  }
                  label="Sold Out"
                />
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Add Button */}
                <IconButton
                  onClick={addBatch}
                  color="primary"
                  size="small"
                  sx={{
                    bgcolor: "#f97316",
                    color: "white",
                    "&:hover": { bgcolor: "#ea580c" },
                  }}
                >
                  <FaPlus />
                </IconButton>

                {/* Remove Button */}
                <IconButton
                  onClick={() => {
                    const newBatches = batches.filter((_, i) => i !== index);
                    setBatches(newBatches);
                  }}
                  color="error"
                  size="small"
                >
                  <FaMinus />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Bulk Edit Dialog */}
      <BulkEditDialog
        open={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        onApply={handleAddBatches}
      />
    </Box>
  );
}

export default BatchManagement;
