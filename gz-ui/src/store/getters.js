const getters = {
  sidebar: state => state.app.sidebar,
  appAside: state => state.app.appAside,
  visitedViews: state => state.app.visitedViews,
  callScreens: state => state.app.callScreens,
  activeCallScreen: state => state.app.activeCallScreen,
  
  userInfo: state => state.user.userInfo,
  token: state => state.user.token,
  portrait: state => state.user.portrait,
  name: state => state.user.name,
  username: state => state.user.username,
  tenantId: state => state.user.tenantId,
  actualTenantId: state => state.user.actualTenantId,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,
  loadSoftPhone: state => state.user.loadSoftPhone,
  setting: state => state.user.setting,
  
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  permissionMenus: state => state.user.permissionMenus
};
export default getters
