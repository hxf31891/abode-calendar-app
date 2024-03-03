interface PermissionLevels {
  [key: string]: string;
}

export const permissionLevels: PermissionLevels = {
  ALL: "all",
  READ: "read",
  WRITE: "write",
  LIST: "list",
  GET: "get",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

interface PermissionRequirements {
  [key: string]: string[];
}

export const permissionRequirements: PermissionRequirements = {
  all: ["all"],
  read: ["all", "read"],
  write: ["all", "write"],
  list: ["all", "read", "list"],
  create: ["all", "write", "create"],
  update: ["all", "write", "update"],
  delete: ["all", "write", "delete"],
};

export const verifyPermissionLevel = (requiredPermissionLevel: any, grantedPermissionLevels: any) => {
  const allowablePermissions = permissionRequirements[requiredPermissionLevel];
  if (Array.isArray(allowablePermissions)) {
    if (Array.isArray(grantedPermissionLevels)) {
      return grantedPermissionLevels.some((p) => allowablePermissions.includes(p));
    } else {
      return allowablePermissions.includes(grantedPermissionLevels);
    }
  } else {
    console.error("Invalid permission level", requiredPermissionLevel);
    return false;
  }
};
