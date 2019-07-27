/**
 * Created by bo.liu01 on 2017/11/7.
 */

"use strict";

import {numberReg} from '@/components/public/regular';
import $ from 'jquery';
/**
 * 检验是否数字，必须，值不能为空
 * @param name
 * @param max
 * @param min
 * @param validator
 * @returns {function(*, *=, *)}
 */
export function checkNumberRequire(name, min, max, validator){
  return (rule, value, callback)=>{
    var res = checkValueBlank(value, name);
    if(res){
      callback(res);
      return;
    }
    checkNum(rule, value, callback, name, min, max, validator);
  };
}

/**
 * 检验是否数字，非必须
 * @param name
 * @param max
 * @param min
 * @param validator
 * @returns {function(*, *=, *)}
 */
export function checkNumber(name, min, max, validator){
  return (rule, value, callback)=>{
    if (!value && !validator) {
      callback();
      return;
    }
    checkNum(rule, value, callback, name, min, max, validator);
  };
}

function checkNum(rule, value, callback, name, min, max, validator) {
  if (!numberReg.test(value)) {
    callback(new Error('请输入数字'));
  } else if(max || min){
    value = parseInt(value);
    if (value < min || value > max) {
      callback(new Error(name + '必须是' + min + "-" + max + "之间的数字"));
    }
  }
  if(validator){
    validator(rule, value, callback, name, min, max);
  }else{
    callback();
  }
}

function checkValueBlank(value, name) {
  if (!value || $.trim(value) == '') {
    return new Error('请输入'+name);
  }
  return null;
}

function checkBase(rule, value, callback, name, min, max, validator) {
  if (value && min && max && (value.length > max || value.length < min)) {
    callback(new Error('长度在 ' + min + ' 到 ' + max + ' 个字符'));
  }
  if(validator){
    validator(rule, value, callback, name, min, max);
  }else{
    callback();
  }
}

/**
 * 校验普通字符串，必填
 * @param name 字段名称
 * @param min 最小长度
 * @param max 最大长度
 * @param validator 自定义验证器
 * @returns {function(*=, *=, *=)}
 */
export function checkRequire(name, min, max, validator) {
  return (rule, value, callback)=>{
    var res = checkValueBlank(value, name);
    if(res){
      callback(res);
      return ;
    }
    checkBase(rule, value, callback, name, min, max, validator);
  };
}

/**
 * 校验普通字符串，非必填
 * @param name 字段名称
 * @param min 最小长度
 * @param max 最大长度
 * @param validator 自定义验证器
 * @returns {function(*, *=, *)}
 */
export function check(name, min, max, validator) {
  return (rule, value, callback)=>{
    if (!value && !validator) {
      callback();
      return;
    }
    checkBase(rule, value, callback, name, min, max, validator);
  };
}

/**
 * 自定义验证器示例
 * @param rule
 * @param value 字段的值
 * @param callback
 * @param name 字段的显示名称
 * @param min 最小长度(value是字符串的时候)或者最小值(value是数字的时候)
 * @param max 最大长度(value是字符串的时候)或者最大值(value是数字的时候)
 * @returns {*}
 * @private
 */
function _validator(rule, value, callback, name, min, max) {

  if(true){//验证通过
    callback();
  }else{//验证不通过
    callback(new Error("您定义的不通过提示语"));
  }
}

/**
 * 产生一个基于失去焦点事件的验证
 * @param validator
 * @returns {[*]}
 */
export function creatValid(validator){
  return [
    {validator: validator, trigger: 'blur'}
  ];
}
