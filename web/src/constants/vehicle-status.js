export const VEHICLE_STATUS = {
  ACTIVE: String('active'),
  OUT_OF_SERVICE: String('out_of_service'),
  UNAVAILABLE: String('unavailable')
}

export const isOutOfService = (value) => String(value) === VEHICLE_STATUS.OUT_OF_SERVICE
export const isUnavailable = (value) => String(value) === VEHICLE_STATUS.UNAVAILABLE