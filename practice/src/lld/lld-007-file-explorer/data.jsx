export const data = {
  id: "1",
  name: "root",
  isFolder: true,
  items: [
    {
      id: "2",
      name: "public",
      isFolder: true,
      items: [
        { id: "3", name: "index.html", isFolder: false, items: [] },
        { id: "4", name: "robots.txt", isFolder: false, items: [] },
      ],
    },
    {
      id: "5",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "6",
          name: "components",
          isFolder: true,
          items: [{ id: "7", name: "Header.js", isFolder: false, items: [] }],
        },
        { id: "8", name: "App.js", isFolder: false, items: [] },
      ],
    },
  ],
};
