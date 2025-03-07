const permissionsList = [
    "Create Event",
    "List Role Opening",
    "Update Links",
    "Assign Position",
    "Update Budget",
];

// Committee members with assigned permissions
const committeeMembers = [
    {
        title: "Jane Doe",
        description: "President",
        avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Andrea",
        permissions: [...permissionsList], // President gets all permissions
    },
    {
        title: "John Doe",
        description: "Vice-President",
        avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Nolan",
        permissions: permissionsList.filter(perm => perm !== "Assign Position"), // Exclude "Assign Position"
    },
    {
        title: "Jane Doe",
        description: "Secretary",
        avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Ryan",
        permissions: ["Update Links"], // Only "Update Links" permission
    },
    {
        title: "John Doe",
        description: "Treasurer",
        avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Mason",
        permissions: ["Update Budget"], // Only "Update Budget" permission
    },
];

export default committeeMembers;