export const treeData = [
  // Define the hierarchical checkbox structure
  {
    id: 1,
    label: "Parent 1",
    children: [
      { id: 2, label: "Child 1-1" }, // Child node
      { id: 3, label: "Child 1-2" }, // Child node
    ],
  },
  {
    id: 4,
    label: "Parent 2",
    children: [
      {
        id: 5,
        label: "Child 2-1",
        children: [
          { id: 6, label: "Grandchild 2-1-1" }, // Grandchild node
        ],
      },
    ],
  },
];
