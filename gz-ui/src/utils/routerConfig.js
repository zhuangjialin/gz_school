
const _res=

{
    "code": 1000,
    "data": {
        "info": {
            "atvFlag": 1,
            "email": "12456@123.com",
            "joinDate": "2018-05-29",
            "loadSoftPhone": "0",
            "loginTime": "2019-07-24 22:15:09",
            "loginType": "1",
            "name": "超级管理员",
            "origins": "icm",
            "path": "L2Rvd25sb2FkL2ZpbGUvcG9ydHJhaXQvVHVsaXBzXzIwMTkwMzI4MDkxNzUzLmpwZw",
            "phone": "111",
            "portrait": "/download/file/portrait/Tulips_20190328091753.jpg",
            "rightTenantId": "DEFAULT",
            "sign": "eee2b8b9194cbfd1d4c7632d179c84b8",
            "sortNum": 0,
            "tenantId": "DEFAULT",
            "username": "admin"
        },
        "permissions": [
            "taskJob.pause",
            "post.view",
            "role.insert",
            "role.update",
            "menus.relate-delete",
            "param.insert",
            "userOrg.delete",
            "role.delete",
            "taskJob.delete",
            "department.update",
            "param.update",
            "param.delete",
            "group.view",
            "user.department-update",
            "dict.view",
            "taskJob.active",
            "user.department-insert",
            "user.department-delete",
            "menuTemplate-editMenu",
            "department.delete",
            "role-type.insert",
            "tenant.view",
            "userOrg.insert",
            "taskJob.insert",
            "menus.relate-insert",
            "ceshi1.chakan",
            "user.delete",
            "user.insert",
            "user.passwor-reset",
            "menuTemplate-add",
            "tenant.delete",
            "role-type.view",
            "tenant.add",
            "user.role",
            "dict.insert",
            "menus.relate-view",
            "role-type.update",
            "department.insert",
            "menuTemplate-delete",
            "resource.view",
            "param.view",
            "group.groupUser.insert",
            "menus.update",
            "post.insert",
            "userOrg.view",
            "userAgent.insert",
            "userAgent.update",
            "group.delete",
            "dict.insertFirst",
            "role.view",
            "post.delete",
            "operLog.view",
            "group.insert",
            "group.update",
            "role-removeUser",
            "group.groupUser.delete",
            "menuTemplate-view",
            "department.view",
            "tenant.update",
            "dict.update",
            "userAgent.view",
            "role-addUser",
            "menus.insert",
            "resource.reflush",
            "dict.delete",
            "post.update",
            "user.view",
            "menus.view",
            "user.update",
            "user.auth",
            "role.auth",
            "role-type.delete",
            "module.view",
            "user.department-view",
            "department.addUser",
            "taskJob.view",
            "menuTemplate-update",
            "taskJob.execute",
            "menus.delete",
            "userOrg.update",
            "userAgent.delete",
            "taskJob.update",
            "department.removeUser"
        ],
        "roles": [
            "超级管理员"
        ],
        "routeConfigs": [
            {
                "absolutePath": "/ceshi",
                "caseSensitive": false,
                "children": [
                    {
                        "absolutePath": "/ceshi/ceshi1",
                        "caseSensitive": false,
                        "code": "ceshi1",
                        "component": "admin/vue/test",
                        "icon": "el-icon-menu",
                        "meta": {
                            "keepAlive": true,
                            "title": "测试1"
                        },
                        "name": "ceshi1",
                        "parentCode": "ceshi",
                        "path": "ceshi1",
                        "sortNum": 0,
                        "title": "测试1",
                        "type": 2
                    }
                ],
                "code": "ceshi",
                "icon": "el-icon-menu",
                "meta": {
                    "keepAlive": true,
                    "title": "测试"
                },
                "name": "ceshi",
                "parentCode": "",
                "path": "/ceshi",
                "sortNum": 0,
                "title": "测试",
                "type": 1
            },
            {
                "absolutePath": "/system",
                "caseSensitive": false,
                "children": [
                    {
                        "absolutePath": "/system/tenantConfig",
                        "caseSensitive": false,
                        "children": [
                            {
                                "absolutePath": "/system/tenantConfig/tenant",
                                "caseSensitive": false,
                                "code": "tenant",
                                "component": "admin/vue/tenant",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "租户管理"
                                },
                                "name": "tenant",
                                "parentCode": "tenantConfig",
                                "path": "tenant",
                                "title": "租户管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/tenantConfig/menuTemplate",
                                "caseSensitive": false,
                                "code": "menuTemplate",
                                "component": "admin/vue/menuTemplate",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "租户模板"
                                },
                                "name": "menuTemplate",
                                "parentCode": "tenantConfig",
                                "path": "menuTemplate",
                                "sortNum": 0,
                                "title": "租户模板",
                                "type": 2
                            }
                        ],
                        "code": "tenantConfig",
                        "icon": "el-icon-menu",
                        "meta": {
                            "keepAlive": true,
                            "title": "租户配置"
                        },
                        "name": "tenantConfig",
                        "parentCode": "system",
                        "path": "tenantConfig",
                        "sortNum": 0,
                        "title": "租户配置",
                        "type": 1
                    },
                    {
                        "absolutePath": "/system/base",
                        "caseSensitive": false,
                        "children": [
                            {
                                "absolutePath": "/system/base/user",
                                "caseSensitive": false,
                                "code": "user",
                                "component": "admin/vue/user",
                                "icon": "icm icon-friend",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "用户管理"
                                },
                                "name": "user",
                                "parentCode": "base",
                                "path": "user",
                                "sortNum": 0,
                                "title": "用户管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/base/department",
                                "caseSensitive": false,
                                "code": "department",
                                "component": "admin/vue/department",
                                "icon": "icm icon-987caidan_zuzhijiagou",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "组织机构"
                                },
                                "name": "department",
                                "parentCode": "base",
                                "path": "department",
                                "sortNum": 1,
                                "title": "组织机构",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/base/post",
                                "caseSensitive": false,
                                "code": "post",
                                "component": "admin/vue/post",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "职位管理"
                                },
                                "name": "post",
                                "parentCode": "base",
                                "path": "post",
                                "sortNum": 2,
                                "title": "职位管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/base/operLog",
                                "caseSensitive": false,
                                "code": "operLog",
                                "component": "admin/vue/operLog",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "操作日志"
                                },
                                "name": "operLog",
                                "parentCode": "base",
                                "path": "operLog",
                                "sortNum": 3,
                                "title": "操作日志",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/base/group",
                                "caseSensitive": false,
                                "code": "group",
                                "component": "admin/vue/group",
                                "icon": "icm icon-caidanfenlei",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "小组管理"
                                },
                                "name": "group",
                                "parentCode": "base",
                                "path": "group",
                                "sortNum": 4,
                                "title": "小组管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/base/userOrg",
                                "caseSensitive": false,
                                "code": "userOrg",
                                "component": "admin/vue/userOrg",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "组织关系"
                                },
                                "name": "userOrg",
                                "parentCode": "base",
                                "path": "userOrg",
                                "sortNum": 6,
                                "title": "组织关系",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/base/userAgent",
                                "caseSensitive": false,
                                "code": "userAgent",
                                "component": "admin/vue/userAgent",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "坐席工号"
                                },
                                "name": "userAgent",
                                "parentCode": "base",
                                "path": "userAgent",
                                "sortNum": 7,
                                "title": "坐席工号",
                                "type": 2
                            }
                        ],
                        "code": "base",
                        "icon": "icm icon-shezhi",
                        "meta": {
                            "keepAlive": true,
                            "title": "基础管理"
                        },
                        "name": "base",
                        "parentCode": "system",
                        "path": "base",
                        "sortNum": 1,
                        "title": "基础管理",
                        "type": 1
                    },
                    {
                        "absolutePath": "/system/role-auth",
                        "caseSensitive": false,
                        "children": [
                            {
                                "absolutePath": "/system/role-auth/role",
                                "caseSensitive": false,
                                "code": "role",
                                "component": "admin/vue/role",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "角色管理"
                                },
                                "name": "role",
                                "parentCode": "role-auth",
                                "path": "role",
                                "title": "角色管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/role-auth/role-type",
                                "caseSensitive": false,
                                "code": "role-type",
                                "component": "admin/vue/roleType",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "角色类型"
                                },
                                "name": "role-type",
                                "parentCode": "role-auth",
                                "path": "role-type",
                                "title": "角色类型",
                                "type": 2
                            }
                        ],
                        "code": "role-auth",
                        "icon": "el-icon-menu",
                        "meta": {
                            "keepAlive": true,
                            "title": "角色权限"
                        },
                        "name": "role-auth",
                        "parentCode": "system",
                        "path": "role-auth",
                        "sortNum": 2,
                        "title": "角色权限",
                        "type": 1
                    },
                    {
                        "absolutePath": "/system/system_config",
                        "caseSensitive": false,
                        "children": [
                            {
                                "absolutePath": "/system/system_config/menus",
                                "caseSensitive": false,
                                "code": "menus",
                                "component": "admin/vue/menus",
                                "icon": "icm icon-caidanfenlei",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "菜单管理"
                                },
                                "name": "menus",
                                "parentCode": "system_config",
                                "path": "menus",
                                "sortNum": 0,
                                "title": "菜单管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/system_config/dict",
                                "caseSensitive": false,
                                "code": "dict",
                                "component": "admin/vue/dict",
                                "icon": "icm icon-caidanfenlei",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "数据字典"
                                },
                                "name": "dict",
                                "parentCode": "system_config",
                                "path": "dict",
                                "sortNum": 1,
                                "title": "数据字典",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/system_config/param",
                                "caseSensitive": false,
                                "code": "param",
                                "component": "admin/vue/param",
                                "icon": "icm icon-caidanfenlei",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "参数配置"
                                },
                                "name": "param",
                                "parentCode": "system_config",
                                "path": "param",
                                "sortNum": 2,
                                "title": "参数配置",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/system_config/taskJob",
                                "caseSensitive": false,
                                "code": "taskJob",
                                "component": "schedule/vue/taskJob",
                                "icon": "el-icon-menu",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "定时调度"
                                },
                                "name": "taskJob",
                                "parentCode": "system_config",
                                "path": "taskJob",
                                "sortNum": 3,
                                "title": "定时调度",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/system_config/module",
                                "caseSensitive": false,
                                "code": "module",
                                "component": "admin/vue/module",
                                "icon": "icm icon-createtask_fill",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "模块管理"
                                },
                                "name": "module",
                                "parentCode": "system_config",
                                "path": "module",
                                "sortNum": 4,
                                "title": "模块管理",
                                "type": 2
                            },
                            {
                                "absolutePath": "/system/system_config/resource",
                                "caseSensitive": false,
                                "code": "resource",
                                "component": "admin/vue/resource",
                                "icon": "icm icon-986caidan_ziyuangongxiang",
                                "meta": {
                                    "keepAlive": true,
                                    "title": "资源管理"
                                },
                                "name": "resource",
                                "parentCode": "system_config",
                                "path": "resource",
                                "sortNum": 5,
                                "title": "资源管理",
                                "type": 2
                            }
                        ],
                        "code": "system_config",
                        "icon": "el-icon-menu",
                        "meta": {
                            "keepAlive": true,
                            "title": "系统配置"
                        },
                        "name": "system_config",
                        "parentCode": "system",
                        "path": "system_config",
                        "sortNum": 3,
                        "title": "系统配置",
                        "type": 1
                    }
                ],
                "code": "system",
                "component": "",
                "icon": "icm icon-setting",
                "meta": {
                    "keepAlive": true,
                    "title": "系统管理"
                },
                "name": "system",
                "parentCode": "",
                "path": "/system",
                "sortNum": 1,
                "title": "系统管理",
                "type": 1
            }
        ]
    },
    "msg": "成功",
    "rel": true,
    "success": true
};
export {
	_res
}