export const languageCodes = {
  eng: 'English',
  chi: '简体中文'
} as const

export function convertToComboBox(){
  return Object.entries(languageCodes).map(([value, label]) => ({ value, label }));
}