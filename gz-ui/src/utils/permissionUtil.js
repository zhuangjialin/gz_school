/**
 * Created by bo.liu01 on 2017/11/21.
 */

import store from '@/store';

/**
 * 判断是否有权限
 * @param pmss 权限标识
 * @returns {*}
 */
export function hasPermission(pmss) {
  var permissions = store.getters.permissions;
  return permissions.indexOf(pmss) > -1;
}
