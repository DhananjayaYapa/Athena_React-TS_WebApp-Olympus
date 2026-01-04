import moment from 'moment'
export const validateFormData = async (data: { [key: string]: any }): Promise<[any, boolean]> => {
  let isValid = true
  let validatedData = data
  return new Promise((resolve) => {
    for (const [field, fieldData] of Object.entries(data)) {
      if (fieldData[`validator`] === 'text') {
        let error = null
        if (fieldData[`isRequired`] && !fieldData[`value`]) {
          error = 'This field is required.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }

      if (fieldData[`validator`] === 'date') {
        let error = null
        if (
          fieldData[`isRequired`] &&
          (!fieldData[`value`] || !moment(fieldData[`value`]).isValid())
        ) {
          // Custom message for year field
          if (field === 'year') {
            error = 'This year is required.'
          } else {
            error = 'This valid date is required.'
          }
          isValid = false
        }

        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }

      if (fieldData[`validator`] === 'object') {
        let error = null
        if (
          fieldData[`isRequired`] &&
          (!fieldData[`value`] ||
            (!!fieldData[`value`] &&
              Object.keys(fieldData[`value`]).length === 0 &&
              fieldData[`value`].constructor === Object))
        ) {
          error = 'This field is required.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }

      if (fieldData[`validator`] === 'array') {
        let error = null
        if (!!fieldData[`value`] && fieldData[`value`].length === 0 && fieldData[`isRequired`]) {
          error = 'This field is required.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }

      if (fieldData[`validator`] === 'email') {
        let error = null
        if (fieldData[`isRequired`] && !fieldData[`value`]) {
          error = 'This field is required.'
          isValid = false
        }
        if (!!fieldData[`value`]) {
          let lastAtPos = fieldData[`value`].lastIndexOf('@')
          let lastDotPos = fieldData[`value`].lastIndexOf('.')
          if (
            !(
              lastAtPos < lastDotPos &&
              lastAtPos > 0 &&
              fieldData[`value`].indexOf('@@') === -1 &&
              lastDotPos > 2 &&
              fieldData[`value`].length - lastDotPos > 2
            )
          ) {
            isValid = false
            error = 'Email is not valid'
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }

      if (fieldData[`validator`] === 'file') {
        let error = null
        if (fieldData[`isRequired`] && (fieldData[`value`]?.length === 0 || !fieldData[`value`])) {
          error = 'This field is required.'
          isValid = false
        }

        if (!!fieldData[`value`] && fieldData[`value`]?.length > 0) {
          if (fieldData[`isAllowed`] !== '*') {
            if (!validateFileExtension(fieldData[`value`].name, fieldData[`isAllowed`])) {
              error = 'Invalid File Format.'
              isValid = false
            }
            let invalidFileList = ''
            for (const file of fieldData[`value`]) {
              if (!validateFileExtension(file.name, fieldData[`isAllowed`])) {
                invalidFileList += `${file.name},`
                isValid = false
              }
            }
            const invalidFileMessage = invalidFileList?.length > 0 ? ':Invalid file type`' : ''
            // error = `${invalidFileList} :Invalid file type`
            error = invalidFileList + invalidFileMessage
          }
        }

        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }

      if (fieldData[`validator`] === 'number') {
        let error = null
        if (fieldData[`isRequired`] && fieldData[`value`].length === 0) {
          error = 'This field is required.'
          isValid = false
        }
        if (fieldData[`value`] < 0) {
          error = 'This field must be a positive number.'
          isValid = false
        }
        if (fieldData[`value`]) {
          if (!!isNaN(fieldData[`value`])) {
            isValid = false
            error = 'This field must be a number'
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...(fieldData as {}),
            error: error,
          },
        }
      }
    }
    resolve([validatedData, isValid])
  })
}
const validateFileExtension = (filename: any, format: any): boolean => {
  const extension = filename.split('.').pop().toLowerCase()
  return extension === format
}
