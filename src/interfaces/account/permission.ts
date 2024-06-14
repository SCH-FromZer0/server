type Permission = 'administration';

interface PermissionForBoard {}

interface PermissionForManage {
    base: boolean,
    master: boolean
}

interface Permissions {
    administration: PermissionForManage
}

export type {
    Permissions
}
