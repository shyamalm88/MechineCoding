# Nested Comments / Threaded Discussion

## Problem Statement

Build a **Nested Comments** system (like Reddit, Hacker News, or any threaded discussion) where users can:
- View hierarchical comment threads
- Reply to any comment (creating nested replies)
- Edit existing comments
- Delete comments

## Requirements

### Core Features
1. Display nested comment threads with proper indentation
2. Reply to any comment (nested infinitely)
3. Edit comment text
4. Delete comments
5. Show author name for each comment

### User Interactions
- Click "Reply" → show reply input
- Click "Edit" → switch to edit mode
- Click "Delete" → remove comment
- Submit → save changes

## Visual Representation

```
┌────────────────────────────────────────────────┐
│ This is the first comment                      │
│ author: Alice                                  │
│ [Reply] [Edit] [Delete]                        │
│                                                │
│   ┌────────────────────────────────────────┐  │
│   │ This is a reply                        │  │
│   │ author: Bob                            │  │
│   │ [Reply] [Edit] [Delete]                │  │
│   │                                        │  │
│   │   ┌────────────────────────────────┐  │  │
│   │   │ Nested reply to Bob           │  │  │
│   │   │ author: You                    │  │  │
│   │   │ [Reply] [Edit] [Delete]        │  │  │
│   │   └────────────────────────────────┘  │  │
│   └────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

## Key Concepts & Intuition

### 1. Recursive Data Structure

Comments form a **tree** where each comment can have children:

```javascript
{
  id: 1,
  author: "Alice",
  text: "This is the first comment",
  children: [
    {
      id: 2,
      author: "Bob",
      text: "This is a reply",
      children: [
        {
          id: 3,
          author: "You",
          text: "Nested reply",
          children: []
        }
      ]
    }
  ]
}
```

### 2. Recursive Component for Rendering

```jsx
function CommentItem({ comment, onReply, onEdit, onDelete }) {
  return (
    <div style={{ marginLeft: "20px" }}>
      <p>{comment.text}</p>
      <span>author: {comment.author}</span>
      <button onClick={() => onReply(comment)}>Reply</button>

      {/* Recursively render children */}
      {comment.children.map(child => (
        <CommentItem
          key={child.id}
          comment={child}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

### 3. Recursive Tree Operations

#### Add Reply
Find the parent comment and add to its children:

```javascript
function addReply(tree, parentComment, newComment) {
  return tree.map(node => {
    if (node.id === parentComment.id) {
      // Found parent - add reply to children
      return {
        ...node,
        children: [...node.children, newComment]
      };
    }
    // Not found - search in children
    return {
      ...node,
      children: addReply(node.children, parentComment, newComment)
    };
  });
}
```

#### Update Comment
Find and update the text:

```javascript
function updateComment(tree, targetComment, newText) {
  return tree.map(node => {
    if (node.id === targetComment.id) {
      return { ...node, text: newText };
    }
    return {
      ...node,
      children: updateComment(node.children, targetComment, newText)
    };
  });
}
```

#### Delete Comment
Filter out the comment:

```javascript
function deleteComment(tree, id) {
  return tree
    .filter(node => node.id !== id)  // Remove if found at this level
    .map(node => ({
      ...node,
      children: deleteComment(node.children, id)  // Search in children
    }));
}
```

### 4. The map().map() Pattern

Notice how operations always:
1. `.map()` to iterate through current level
2. Recurse with `.map()` (or other operation) on children

```javascript
tree.map(node => ({
  ...node,
  children: recursiveOperation(node.children, ...)
}));
```

This ensures we:
- Create new objects (immutability)
- Visit every node
- Maintain tree structure

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CommentsSection                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  State: commentsData (array of comment trees)        │   │
│  │  Handlers: handleReply, handleEdit, handleDelete     │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│            map through root comments                         │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  CommentItem                         │   │
│  │  Props: comment, onReply, onEdit, onDelete          │   │
│  │  Local State: isReplying, isEditing, editText       │   │
│  │                                                      │   │
│  │  Renders:                                            │   │
│  │  - Comment text & author                            │   │
│  │  - Action buttons                                   │   │
│  │  - Reply input (if isReplying)                      │   │
│  │  - Edit input (if isEditing)                        │   │
│  │  - Children (recursive)                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Tips

### Local UI State vs Global Data State

```javascript
// GLOBAL (lifted to parent): The actual comment data
const [commentsData, setCommentsData] = useState(initialComments);

// LOCAL (in CommentItem): UI interactions
const [isReplying, setIsReplying] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(comment.text);
```

### Unique ID Generation

```javascript
const newComment = {
  id: Date.now() + Math.random() * 10,  // Simple unique ID
  author: "You",
  text: replyText,
  children: []
};
```

**Note:** In production, use UUID or server-generated IDs.

### useCallback for Handlers

Since handlers are passed down through recursion, wrap them in `useCallback` to prevent unnecessary re-renders:

```javascript
const handleReply = useCallback((item, text) => {
  if (!text.trim()) return;
  setCommentsData(prev => addReply(prev, item, newComment));
}, []);
```

## Common Interview Questions

1. **Why is the comment tree an array at the root level?**
   - Supports multiple top-level comments
   - Each root comment has its own thread
   - More flexible than single-root tree

2. **How does indentation work?**
   - Each `CommentItem` has `marginLeft: 20px`
   - Recursive nesting accumulates margin
   - Level 1: 20px, Level 2: 40px, Level 3: 60px...

3. **What if we want to collapse threads?**
   - Add `isCollapsed` state to each CommentItem
   - Conditionally render children based on state
   - Similar to the File Explorer pattern

4. **How would you handle very deep nesting?**
   - Cap visual indentation at certain level
   - "Continue thread →" link to separate view
   - Virtualization for performance

## Edge Cases to Handle

- [ ] Empty reply text - prevent submission
- [ ] Delete comment with children - delete entire subtree or just parent?
- [ ] Edit to empty text - prevent or allow?
- [ ] Very long comments - truncate with "show more"
- [ ] XSS prevention - sanitize user input

## Potential Extensions

1. **Upvote/Downvote** with sorting
2. **Collapse/Expand** threads
3. **Load more** replies (pagination)
4. **Timestamps** and relative time
5. **User avatars**
6. **Markdown support**
7. **@ mentions**

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Add Reply | O(n) | O(n) |
| Update Comment | O(n) | O(n) |
| Delete Comment | O(n) | O(n) |
| Render Tree | O(n) | O(h) |

Where n = total comments, h = max nesting depth

## Key Insight

The pattern is the same for File Explorer and Nested Comments:
- **Recursive data structure** (tree)
- **Recursive component** for rendering
- **Recursive functions** for mutations (add, edit, delete)
- **Immutable updates** (create new tree, don't mutate)

Master this pattern and you can build any tree-based UI!
