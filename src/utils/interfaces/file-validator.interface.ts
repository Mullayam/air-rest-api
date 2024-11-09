export interface FileValidationArgs {
    field: string
    allowedMimeTypes: string[]
    strict?: boolean
  }
  
export interface FileValidationOptions {
    minFieldsRequired?: number
  }