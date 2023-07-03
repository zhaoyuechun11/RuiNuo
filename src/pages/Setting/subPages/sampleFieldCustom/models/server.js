import axiosBase from '@utils/http';

export function display(params) {

  return axiosBase('/apiweb/resumeModule/display', 'get', params);
}

export function create(params) {
  return axiosBase('/apiweb/resumeModule/create', 'post', params);
}
export function moveField(params) {
  return axiosBase('/apiweb/resumeStructure/move', 'post', params);
}
export function moveModule(params) {
  return axiosBase('/apiweb/resumeModule/move', 'post', params);
}
export function deleteModule(params) {
  return axiosBase('/apiweb/resumeModule/delete', 'post', params);
}
export function updateModule(params) {
  return axiosBase('/apiweb/resumeModule/update', 'post', params);
}
export function addField(params) {
  return axiosBase('/apiweb/resumeStructure/create', 'post', params);
}
export function deleteField(params) {
  return axiosBase('/apiweb/resumeStructure/delete', 'post', params);
}
export function updateField(params) {
  return axiosBase('/apiweb/resumeStructure/update', 'post', params);
}
export function patchMove(params) {
  return axiosBase('/apiweb/resumeModule/patchMove', 'post', params);
}
export function patchStructureMove(params) {
  return axiosBase('/apiweb/resumeStructure/patchMove', 'post', params);
}