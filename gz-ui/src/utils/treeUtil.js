/**
 * 
 */

export function createButton(createElement, name,type, func){
  return createElement('el-button',{
    attrs:{
      size:"mini",
      type:type
    },
    on:{
      click:func
    }
  },name);
};
