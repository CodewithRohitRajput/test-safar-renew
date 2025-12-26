"use client";

import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Alert
} from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import moment from 'moment'
import BatchCalendarView from './BatchCalendarView'

const BulkEditDialog = ({ open, onClose, onApply }) => {
  // Form state
  const [tripDateRange, setTripDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [tripDuration, setTripDuration] = useState(3)

  // Pattern state
  const [selectedDays, setSelectedDays] = useState([])
  const [selectedDatesOfMonth, setSelectedDatesOfMonth] = useState([])
  const [selectedMonths, setSelectedMonths] = useState([])
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // Generate arrays for selections
  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ]

  const datesOfMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = moment.months().map((month, index) => ({
    value: index,
    label: month
  }))

  // Calculate batches based on selected patterns
  const generateBatches = () => {
    const tripStart = moment(tripDateRange.startDate)
    const tripEnd = moment(tripDateRange.endDate)
    const tripDuration = tripEnd.diff(tripStart, 'days') + 1 // This is the duration for each batch

    // Calculate the range for generating batches
    // Start from the first day of the earliest selected month
    const batchStartDate = moment()
      .year(tripStart.year())
      .month(
        Math.min(
          ...(selectedMonths.length > 0 ? selectedMonths : [tripStart.month()])
        )
      )
      .startOf('month')

    // End at the last day of the latest selected month
    const batchEndDate = moment()
      .year(tripStart.year())
      .month(
        Math.max(
          ...(selectedMonths.length > 0 ? selectedMonths : [tripStart.month()])
        )
      )
      .endOf('month')

    const batches = []
    let currentDate = batchStartDate.clone()

    while (currentDate.isSameOrBefore(batchEndDate)) {
      const isValidMonth =
        selectedMonths.length === 0 ||
        selectedMonths.includes(currentDate.month())

      const isValidDay =
        selectedDays.length === 0 || selectedDays.includes(currentDate.day())

      const isValidDate =
        selectedDatesOfMonth.length === 0 ||
        selectedDatesOfMonth.includes(currentDate.date())

      if (isValidMonth && isValidDay && isValidDate) {
        const batchEndDate = currentDate.clone().add(tripDuration - 1, 'days')

        const startDateStr = currentDate
          .clone()
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        const endDateStr = batchEndDate
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

        batches.push({
          start_date: startDateStr,
          end_date: endDateStr,
          is_sold: false
        })
      }

      currentDate.add(1, 'days')
    }

    return batches
  }

  // Calculate preview count
  const batchCount = useMemo(() => {
    if (!tripDateRange.startDate || !tripDateRange.endDate) return 0
    return generateBatches().length
  }, [tripDateRange, selectedDays, selectedDatesOfMonth, selectedMonths])

  const handleApply = () => {
    if (!tripDateRange.startDate || !tripDateRange.endDate) return

    const batches = generateBatches()
    onApply(batches)
    onClose()

    // Reset form
    setTripDateRange({ startDate: '', endDate: '' })
    setSelectedDays([])
    setSelectedDatesOfMonth([])
    setSelectedMonths([])
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '0.5rem',
          outline: 'none',
          width: '90%',
          maxWidth: '800px'
        }
      }}
    >
      <Box sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937'
            }}
          >
            Generate Batches
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              p: '4px',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                borderRadius: '9999px',
                transition: 'background-color 0.2s'
              }
            }}
          >
            <RxCross2 size={24} />
          </IconButton>
        </Box>

        {/* Date Range and Duration */}
        {/* <Box sx={{ mb: 4, p: 3, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
            Basic Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: '200px' }}
            />
            <TextField
              type="date"
              label="End Date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: '200px' }}
            />
            <TextField
              type="number"
              label="Trip Duration (days)"
              value={tripDuration}
              onChange={(e) => setTripDuration(Number(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ minWidth: '150px' }}
            />
          </Box>
        </Box> */}
      </Box>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Basic Settings */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              mb: 1
            }}
          >
            Trip Dates
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2
            }}
          >
            <TextField
              type="date"
              label="Trip Start Date"
              value={tripDateRange.startDate}
              onChange={(e) =>
                setTripDateRange((prev) => ({
                  ...prev,
                  startDate: e.target.value
                }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.5rem',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f97316',
                    borderWidth: '2px'
                  }
                }
              }}
            />
            <TextField
              type="date"
              label="Trip End Date"
              value={tripDateRange.endDate}
              onChange={(e) =>
                setTripDateRange((prev) => ({
                  ...prev,
                  endDate: e.target.value
                }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.5rem',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f97316',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Pattern Selection */}

        <Box
          sx={{
            p: 3,
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            bgcolor: 'white'
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              mb: 3
            }}
          >
            Custom Pattern (Optional)
          </Typography>

          {/* Days of Week */}
          <FormGroup sx={{ mb: 4 }}>
            <FormLabel
              sx={{
                color: '#4b5563',
                fontSize: '0.875rem',
                fontWeight: 500,
                mb: 1.5
              }}
            >
              Days of Week
            </FormLabel>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 1
              }}
            >
              {daysOfWeek.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={selectedDays.includes(day.value)}
                      onChange={(e) => {
                        setSelectedDays((prev) =>
                          e.target.checked
                            ? [...prev, day.value]
                            : prev.filter((d) => d !== day.value)
                        )
                      }}
                      sx={{
                        color: '#d1d5db',
                        '&.Mui-checked': {
                          color: '#f97316'
                        },
                        '&:hover': {
                          bgcolor: '#fff7ed'
                        }
                      }}
                    />
                  }
                  label={day.label}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }
                  }}
                />
              ))}
            </Box>
          </FormGroup>

          {/* Dates of Month */}
          <FormGroup sx={{ mb: 4 }}>
            <FormLabel
              sx={{
                color: '#4b5563',
                fontSize: '0.875rem',
                fontWeight: 500,
                mb: 1.5
              }}
            >
              Dates of Month
            </FormLabel>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(4, 1fr)',
                  sm: 'repeat(7, 1fr)',
                  md: 'repeat(8, 1fr)'
                },
                gap: 1
              }}
            >
              {datesOfMonth.map((date) => (
                <FormControlLabel
                  key={date}
                  control={
                    <Checkbox
                      checked={selectedDatesOfMonth.includes(date)}
                      onChange={(e) => {
                        setSelectedDatesOfMonth((prev) =>
                          e.target.checked
                            ? [...prev, date]
                            : prev.filter((d) => d !== date)
                        )
                      }}
                      sx={{
                        color: '#d1d5db',
                        '&.Mui-checked': {
                          color: '#f97316'
                        },
                        '&:hover': {
                          bgcolor: '#fff7ed'
                        }
                      }}
                    />
                  }
                  label={date}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }
                  }}
                />
              ))}
            </Box>
          </FormGroup>

          {/* Months */}
          <FormGroup>
            <FormLabel
              sx={{
                color: '#4b5563',
                fontSize: '0.875rem',
                fontWeight: 500,
                mb: 1.5
              }}
            >
              Months
            </FormLabel>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 1
              }}
            >
              {months.map((month) => (
                <FormControlLabel
                  key={month.value}
                  control={
                    <Checkbox
                      checked={selectedMonths.includes(month.value)}
                      onChange={(e) => {
                        setSelectedMonths((prev) =>
                          e.target.checked
                            ? [...prev, month.value]
                            : prev.filter((m) => m !== month.value)
                        )
                      }}
                      sx={{
                        color: '#d1d5db',
                        '&.Mui-checked': {
                          color: '#f97316'
                        },
                        '&:hover': {
                          bgcolor: '#fff7ed'
                        }
                      }}
                    />
                  }
                  label={month.label}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }
                  }}
                />
              ))}
            </Box>
          </FormGroup>
        </Box>
        {/* Preview */}
        <Box sx={{ mt: 3 }}>
          <Alert
            severity="info"
            sx={{
              borderRadius: '0.75rem',
              backgroundColor: '#fff7ed',
              border: '1px solid #ffedd5',
              '& .MuiAlert-icon': {
                color: '#f97316',
                alignItems: 'center'
              },
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#9a3412',
                    fontWeight: 500,
                    mb: 0.5
                  }}
                >
                  Trip Duration:{' '}
                  <span style={{ fontWeight: 600 }}>
                    {tripDateRange.startDate && tripDateRange.endDate
                      ? moment(tripDateRange.endDate).diff(
                          moment(tripDateRange.startDate),
                          'days'
                        ) + 1
                      : 0}{' '}
                    days
                  </span>
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#9a3412',
                    fontWeight: 500
                  }}
                >
                  This will generate{' '}
                  <span style={{ fontWeight: 600 }}>{batchCount} batches</span>
                </Typography>
              </Box>
              <Button
                onClick={() => setShowPreviewDialog(true)}
                disabled={batchCount === 0}
                variant="outlined"
                sx={{
                  borderColor: '#f97316',
                  color: '#f97316',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: '0.5rem',
                  '&:hover': {
                    borderColor: '#ea580c',
                    backgroundColor: '#fff7ed'
                  },
                  '&.Mui-disabled': {
                    borderColor: '#fed7aa',
                    color: '#fed7aa'
                  }
                }}
              >
                Preview Batches
              </Button>
            </Box>
          </Alert>

          {/* Preview Dialog */}
          <Dialog
            open={showPreviewDialog}
            onClose={() => setShowPreviewDialog(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '0.75rem',
                maxWidth: '800px',
                m: 2
              }
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  pb: 2,
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}
                >
                  Preview Generated Batches
                </Typography>
                <IconButton
                  onClick={() => setShowPreviewDialog(false)}
                  sx={{
                    color: '#6b7280',
                    p: 1,
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                      borderRadius: '9999px'
                    }
                  }}
                >
                  <RxCross2 size={20} />
                </IconButton>
              </Box>

              <BatchCalendarView batches={generateBatches()} />
            </Box>
          </Dialog>
        </Box>
      </Box>

      {/* Apply Button */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e5e7eb',
          bgcolor: '#f9fafb',
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            px: 3,
            py: 1,
            color: '#374151',
            bgcolor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#f3f4f6',
              borderColor: '#9ca3af'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          disabled={!tripDateRange.startDate || !tripDateRange.endDate}
          sx={{
            px: 3,
            py: 1,
            color: 'white',
            bgcolor: '#f97316',
            borderRadius: '0.5rem',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#ea580c'
            },
            '&:disabled': {
              bgcolor: '#fed7aa',
              color: 'white'
            }
          }}
        >
          Generate Batches
        </Button>
      </Box>
    </Dialog>
  )
}

export default BulkEditDialog
