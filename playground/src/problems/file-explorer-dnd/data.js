export const initialTree = {
  id: "root",
  name: "root",
  isFolder: true,
  items: [
    {
      id: "public",
      name: "public",
      isFolder: true,
      items: [
        { id: "index.html", name: "index.html", isFolder: false, items: [] },
        { id: "robots.txt", name: "robots.txt", isFolder: false, items: [] },
      ],
    },
    {
      id: "src",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "components",
          name: "components",
          isFolder: true,
          items: [
            { id: "Header.js", name: "Header.js", isFolder: false, items: [] },
            { id: "Footer.js", name: "Footer.js", isFolder: false, items: [] },
          ],
        },
        { id: "App.js", name: "App.js", isFolder: false, items: [] },
        { id: "index.js", name: "index.js", isFolder: false, items: [] },
      ],
    },
    { id: "package.json", name: "package.json", isFolder: false, items: [] },
    { id: "README.md", name: "README.md", isFolder: false, items: [] },
  ],
};
