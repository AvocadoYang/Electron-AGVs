export type Err = {
  response: {
    data: {
      msg: string
    }
    status: number
  }
}

export type ErrorOrigin = {
  response: {
    data: string
    status: number
  }
}
