export const PAYMENT_ACCOUNT_STATUS = {
  ACTIVE: String('active'),
  INACTIVE: String('inactive')
}

export const isInactive = (value) => String(value) === PAYMENT_ACCOUNT_STATUS.INACTIVE