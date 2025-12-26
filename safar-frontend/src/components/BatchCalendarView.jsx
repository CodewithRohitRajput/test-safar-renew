import React from 'react'
import { Box, Typography } from '@mui/material'
import { Calendar } from 'react-multi-date-picker'
import moment from 'moment-timezone'

function BatchCalendarView({ batches }) {
  const getDatesBetween = (startDate, endDate) => {
    const dates = []
    let currentDate = moment(startDate)
    const lastDate = moment(endDate)

    while (currentDate.isSameOrBefore(lastDate, 'day')) {
      dates.push(currentDate.format('YYYY-MM-DD'))
      currentDate.add(1, 'days')
    }

    return dates
  }

  const getCalendarHighlights = () => {
    const allDates = new Set()
    batches.forEach((batch) => {
      const dateRange = getDatesBetween(batch.start_date, batch.end_date)
      dateRange.forEach((date) => {
        allDates.add({
          date,
          className: batch.is_sold ? 'sold-out-date' : 'available-date',
          isStart: date === moment(batch.start_date).format('YYYY-MM-DD'),
          isEnd: date === moment(batch.end_date).format('YYYY-MM-DD')
        })
      })
    })
    return Array.from(allDates)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        p: 3,
        '.available-date': {
          backgroundColor: '#fff7ed',
          color: '#f97316',
          borderRadius: '0.375rem',
          position: 'relative',
          '&.start-date': {
            borderTopLeftRadius: '1rem',
            borderBottomLeftRadius: '1rem',
            '&::before': {
              content: '"Start"',
              position: 'absolute',
              top: '-20px',
              fontSize: '0.75rem',
              color: '#f97316'
            }
          },
          '&.end-date': {
            borderTopRightRadius: '1rem',
            borderBottomRightRadius: '1rem',
            '&::after': {
              content: '"End"',
              position: 'absolute',
              bottom: '-20px',
              fontSize: '0.75rem',
              color: '#f97316'
            }
          }
        },
        '.sold-out-date': {
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          borderRadius: '4px',
          position: 'relative',
          '&.start-date': {
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
            '&::before': {
              content: '"Start"',
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              whiteSpace: 'nowrap',
              color: '#d32f2f'
            }
          },
          '&.end-date': {
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
            '&::after': {
              content: '"End"',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              whiteSpace: 'nowrap',
              color: '#d32f2f'
            }
          }
        },
        '.rmdp-wrapper': {
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
          borderRadius: '8px'
        },
        '.rmdp-calendar': {
          padding: '16px'
        },
        '.rmdp-day': {
          height: '40px',
          width: '40px'
        },
        '.rmdp-header': {
          marginBottom: '16px'
        },
        '.rmdp-header-values': {
          fontWeight: 'bold',
          color: '#1976d2'
        }
      }}
    >
      {/* Calendar Legend */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600, mb: 2 }}>
          Batch Calendar
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#fff7ed',
                borderRadius: '0.25rem',
                border: '1px solid #f97316'
              }}
            />
            <Typography sx={{ fontSize: '0.875rem', color: '#4b5563' }}>
              Available
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#fef2f2',
                borderRadius: '0.25rem',
                border: '1px solid #ef4444'
              }}
            />
            <Typography sx={{ fontSize: '0.875rem', color: '#4b5563' }}>
              Sold Out
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Calendar Component */}
      <Calendar
        value={batches.map((batch) => batch.start_date)}
        multiple
        readOnly
        mapDays={({ date }) => {
          const highlight = getCalendarHighlights().find(
            (h) => h.date === date.format('YYYY-MM-DD')
          )
          if (!highlight) return {}

          let className = highlight.className
          if (highlight.isStart) className += ' start-date'
          if (highlight.isEnd) className += ' end-date'

          return { className }
        }}
      />
    </Box>
  )
}

export default BatchCalendarView