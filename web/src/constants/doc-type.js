export const DOC_TYPE = {
  NONE: String('0'),
  DNI: String('1'),
  CE: String('4'),
  RUC: String('6')
}

export const DOC_TYPE_LABEL = {
  [DOC_TYPE.NONE]: 'Sin Documento',
  [DOC_TYPE.DNI]: 'Documento Nacional de Identidad',
  [DOC_TYPE.CE]: 'Carnet de Extranjería',
  [DOC_TYPE.RUC]: 'Registro Único de Contribuyentes'
}

export const DOC_TYPE_ABBREVIATION = {
  [DOC_TYPE.NONE]: 'SD',
  [DOC_TYPE.DNI]: 'DNI',
  [DOC_TYPE.CE]: 'CE',
  [DOC_TYPE.RUC]: 'RUC'
}

export const DOC_TYPE_SIZE = {
  [DOC_TYPE.NONE]: 0,
  [DOC_TYPE.DNI]: 8,
  [DOC_TYPE.CE]: 9,
  [DOC_TYPE.RUC]: 11
}