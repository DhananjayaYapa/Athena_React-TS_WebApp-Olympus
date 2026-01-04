import React, { useState } from 'react'
import { Grid, Box, Card } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { nonWorkingDayActions } from '../../redux/actions'
import { CustomAlert, NonWorkingDayForm, PrimaryButton } from '../../components'
import { AppLayout } from '../../templates'
import { NON_WORKING_DAY_CONSTANTS } from './NonWorkingDay.constants'
import NonWorkingDayCalendar from '../../components/nonWorkingDayCalendar/nonWorkingDayCalendar'
import { AppStateDto, NonWorkingDay, NonWorkingDayPayload } from '../../utilities/models'
import styles from './NonWorkingDay.module.scss'

const NonWorkingDays = () => {
  const dispatch = useDispatch()

  const [nonWorkingDays, setNonWorkingDays] = useState<NonWorkingDay[]>([])
  // const currentYear = new Date().getFullYear()

  const holidays = useSelector((state: AppStateDto) => state.nonWorkingDays.nonWorkingDay)

  //Error message
  const errorMessage = useSelector((state: AppStateDto) => state.nonWorkingDays.nonWorkingDay.error)

  const [errorMessageDisplay, setErrorMessageDisplay] = useState<string | null>(null)

  React.useEffect(() => {
    setErrorMessageDisplay(errorMessage)
  }, [errorMessage])

  //Success message after inserting dates
  const successMessage = useSelector(
    (state: AppStateDto) => state.nonWorkingDays.nonWorkingDay.editedNonWorkingDay
  )

  const [successMessageDisplay, setSuccessMessageDisplay] = useState(successMessage)

  React.useEffect(() => {
    setSuccessMessageDisplay(successMessage)
  }, [successMessage])

  React.useEffect(() => {
    dispatch(nonWorkingDayActions.getNonWorkingDays())

    //Resetting success message on re-render
    setSuccessMessageDisplay(false)

    //Resetting message on re-render
    setIsLoading(false)

    //Resetting error message on re-render
    setErrorMessageDisplay(null)
  }, [])

  const dataLoading = useSelector(
    (state: AppStateDto) => state.nonWorkingDays.nonWorkingDay.isLoading
  )

  const [isLoading, setIsLoading] = useState(dataLoading)

  React.useEffect(() => {
    setIsLoading(dataLoading)
  }, [dataLoading])

  const today = new Date()
  today.setDate(today.getDate() - 1)

  const editNonWorkingDay = (editingDay: NonWorkingDay) => {
    setErrorMessageDisplay(null)
    setSuccessMessageDisplay(false)
    setNonWorkingDays((nonWorkingDays: NonWorkingDay[]) => {
      //Checks if a date is already present in array
      const daySelected = nonWorkingDays.find(
        (thisday: NonWorkingDay) => thisday.date.toString() === editingDay.date.toString()
      )

      if (daySelected) {
        //If selected, user edits are added to the matching nonWorkingDay object
        return nonWorkingDays.map((aNwDay: NonWorkingDay) =>
          aNwDay.date === editingDay.date
            ? {
                ...aNwDay,
                holidayDesc: editingDay.holidayDesc,
                isHalfDay: editingDay.isHalfDay,
                isEnabled: editingDay.isEnabled,
              }
            : aNwDay
        )
      } else {
        //If not selected yet, a new nonWorkingDay object is appended to nonWorkingDays array
        return [
          ...nonWorkingDays,
          {
            nonWorkingDayId: editingDay.nonWorkingDayId,
            date: editingDay.date,
            holidayDesc: editingDay.holidayDesc,
            isHalfDay: editingDay.isHalfDay,
            isEnabled: editingDay.isEnabled,
          },
        ]
      }
    })
  }

  const saveHolidays = () => {
    for (let index = 0; index < nonWorkingDays.length; index++) {
      const day = nonWorkingDays[index]

      if (day.holidayDesc === '') {
        setErrorMessageDisplay('Please add a description for each holiday')
        return
      }

      const selectedDate = day.date

      // Time converted from local timezone to UTC
      selectedDate.setTime(selectedDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000)

      const dateStored = selectedDate.toISOString().split('T')[0]

      if (day.nonWorkingDayId !== -1) {
        // converts nonworkdays to correct format for dispatch
        const nonWorkingDayBody: NonWorkingDayPayload = {
          nonWorkingDayId: day.nonWorkingDayId,
          date: dateStored,
          isHalfDay: day.isHalfDay,
          holidayDesc: day.holidayDesc,
          isEnabled: day.isEnabled,
        }

        //API CALL to update data
        dispatch(nonWorkingDayActions.updateNonWorkingDay(nonWorkingDayBody))
      } else {
        // converts nonworkdays to correct format for dispatch
        const nonWorkingDayBody: NonWorkingDayPayload = {
          date: dateStored,
          isHalfDay: day.isHalfDay,
          holidayDesc: day.holidayDesc,
          isEnabled: day.isEnabled,
        }

        //API CALL to insert data
        dispatch(nonWorkingDayActions.addNonWorkingDay(nonWorkingDayBody))
      }
    }
  }

  const addDay = (day: Date) => {
    //Reset messages
    setErrorMessageDisplay(null)
    setSuccessMessageDisplay(false)

    if (day > today) {
      let hasEvent = false

      //Checks if clicked date has an event saved
      day.setTime(day.getTime() - new Date().getTimezoneOffset() * 60 * 1000)
      holidays.data.every((element: any) => {
        const holiday = element.date.split('T')[0]
        const selectedDay = day.toISOString().split('T')[0]

        if (holiday === selectedDay) {
          hasEvent = true
          return false
        } else {
          return true
        }
      })

      //Ignores date click if the date already has an event
      if (!hasEvent) {
        setNonWorkingDays((nonWorkingDays) => {
          //Checks if a date is already selected from calendar
          const daySelected = nonWorkingDays.find(
            (thisday: NonWorkingDay) => thisday.date.toDateString() === day.toDateString()
          )

          if (daySelected) {
            //If selected, day object is removed from non working days array

            return nonWorkingDays.filter(
              (nwday: NonWorkingDay) => nwday.date.toDateString() !== day.toDateString()
            )
          } else {
            const newDay: NonWorkingDay = {
              nonWorkingDayId: -1,
              date: day,
              holidayDesc: '',
              isEnabled: true,
              isHalfDay: false,
            }
            editNonWorkingDay(newDay)
            // return nonWorkingDays
            return [...nonWorkingDays, newDay]
          }
        })
      } else {
        return
      }
    } else {
      return
    }
  }

  const removeDay = (day: Date) => {
    //Reset messages
    setErrorMessageDisplay(null)
    setSuccessMessageDisplay(false)

    setNonWorkingDays((nonWorkingDays) => {
      //Checks if a date is already selected from calendar
      const daySelected = nonWorkingDays.find(
        (thisday: NonWorkingDay) => thisday.date.toDateString() === day.toDateString()
      )

      if (daySelected) {
        //If selected, day object is removed from non working days array

        return nonWorkingDays.filter(
          (nwday: NonWorkingDay) => nwday.date.toDateString() !== day.toDateString()
        )
      } else {
        const newDay: NonWorkingDay = {
          nonWorkingDayId: -1,
          date: day,
          holidayDesc: '',
          isEnabled: true,
          isHalfDay: false,
        }
        editNonWorkingDay(newDay)
        return nonWorkingDays
      }
    })
  }

  const addDayToEdit = (editingDay: NonWorkingDay) => {
    //Reset messages
    setErrorMessageDisplay(null)
    setSuccessMessageDisplay(false)

    setNonWorkingDays((nonWorkingDays) => {
      //Checks if a date is already selected from calendar
      const daySelected = nonWorkingDays.find(
        (thisday: NonWorkingDay) => thisday.date.toDateString() === editingDay.date.toDateString()
      )

      if (daySelected) {
        //If selected, day object is removed from non working days array

        return nonWorkingDays.filter(
          (nwday: NonWorkingDay) => nwday.date.toDateString() !== editingDay.date.toDateString()
        )
      } else {
        editNonWorkingDay(editingDay)
        return [...nonWorkingDays, editingDay]
      }
    })
  }

  const editDay = (editingDay: NonWorkingDay) => {
    if (editingDay.date > today) {
      addDayToEdit(editingDay)
    } else {
      return
    }
  }

  let submitBtn
  if (nonWorkingDays.length === 0) {
    submitBtn = <p></p>
  } else if (nonWorkingDays.length === 1) {
    submitBtn = (
      <PrimaryButton
        buttonTextLoading={NON_WORKING_DAY_CONSTANTS.SUMBIT_HOLIDAY_BTN_LOADING}
        buttonText={NON_WORKING_DAY_CONSTANTS.SUMBIT_HOLIDAY_BTN_TITLE}
        onClickFunction={saveHolidays}
        isLoading={isLoading}
      ></PrimaryButton>
    )
  } else {
    submitBtn = (
      <PrimaryButton
        buttonTextLoading={NON_WORKING_DAY_CONSTANTS.SUMBIT_HOLIDAY_BTN_LOADING}
        buttonText={NON_WORKING_DAY_CONSTANTS.SUMBIT_HOLIDAY_BTN_TITLE + 's'}
        onClickFunction={saveHolidays}
        isLoading={isLoading}
      ></PrimaryButton>
    )
  }

  // Calendar reference
  const calendarRef = React.createRef()

  return (
    <React.Fragment>
      <AppLayout
        breadcrumb={NON_WORKING_DAY_CONSTANTS.COMPONENT_BREADCRUMB}
        componentTitle={NON_WORKING_DAY_CONSTANTS.COMPONENT_TITLE}
      >
        <Grid container spacing={2} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} direction="column">
            <h3 className="font-weight-bold">{NON_WORKING_DAY_CONSTANTS.COMPONENT_HEADING}</h3>
            <p>{NON_WORKING_DAY_CONSTANTS.COMPONENT_DECRIPTION}</p>
            <Card variant="outlined" className={styles.message}>
              {NON_WORKING_DAY_CONSTANTS.COMPONENT_ACTION}
            </Card>
            <Box mt={2}>{submitBtn}</Box>
            <Box mt={2}>
              {errorMessageDisplay ? (
                <CustomAlert displayText={errorMessageDisplay} severity="warning" />
              ) : null}
              {successMessageDisplay ? (
                <CustomAlert displayText={successMessageDisplay} severity="success" />
              ) : null}
            </Box>
          </Grid>

          {nonWorkingDays.length > 0 || errorMessageDisplay || successMessageDisplay ? (
            <Grid
              size={{ md: 4 }}
              sx={{ direction: 'column', spacing: 4, justify: 'center', alignItems: 'center' }}
            >
              <form>
                {Object.values(nonWorkingDays).map((aNonWorkingDay: NonWorkingDay) => (
                  <NonWorkingDayForm
                    key={aNonWorkingDay.date.toString()}
                    thisNonWorkingDay={aNonWorkingDay}
                    removeDay={removeDay}
                    setNonWorkingDays={editNonWorkingDay}
                  />
                ))}
              </form>
            </Grid>
          ) : null}

          <Grid
            size={{
              md: nonWorkingDays.length > 0 || errorMessageDisplay || successMessageDisplay ? 5 : 9,
            }}
            direction="column"
          >
            <NonWorkingDayCalendar
              calendarReference={calendarRef}
              holidays={holidays}
              editDay={editDay}
              addDay={addDay}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default NonWorkingDays
