const getNavbarItems = (req, res) => {
    const navbar = [
      { name: "Unihub", path: "/" },
      { name: "Clubs", path: "/clubs" },
      { name: "Events", path: "/events" },
      { name: "Role Opening", path: "/roles" },
      { name: "External Events", path: "/external-events" },
      {
        name: "Committee",
        subMenu: [
          { name: "Dashboard", path: "/committee/dashboard" },
          {
            name: "Events",
            subMenu: [
              { name: "Create Event", path: "/committee/events/create" },
              { name: "View/Update Event", path: "/committee/events/manage" },
            ],
          },
          {
            name: "Role Openings",
            subMenu: [
              { name: "Create Role Opening", path: "/committee/roles/create" },
              { name: "View/Update Role Opening", path: "/committee/roles/manage" },
            ],
          },
          { name: "Budget Tracker", path: "/committee/budget-tracker" },
          { name: "Committee Calendar", path: "/committee/calendar" },
        ],
      },
      { name: "Register/Login", path: "/auth" },
    ];
    res.json(navbar);
  };
  
  module.exports = { getNavbarItems };
  