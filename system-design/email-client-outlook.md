# Email Client (Microsoft Outlook) - Frontend System Design

## Table of Contents

1. [Requirements Overview](#1-requirements-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Core Data Types](#3-core-data-types)
4. [Email Store (Zustand)](#4-email-store-zustand)
5. [Email List Data Fetching](#5-email-list-data-fetching)
6. [Virtual Email List Component](#6-virtual-email-list-component)
7. [Email Row Component](#7-email-row-component)
8. [Folder Sidebar Component](#8-folder-sidebar-component)
9. [Reading Pane Component](#9-reading-pane-component)
10. [Email Search Component](#10-email-search-component)
11. [Email Compose Modal](#11-email-compose-modal)
12. [Keyboard Navigation](#12-keyboard-navigation)
13. [Real-time Updates (WebSocket)](#13-real-time-updates-websocket)
14. [Main App Layout](#14-main-app-layout)
15. [Thread View Component](#15-thread-view-component)
16. [Recipient Input with Autocomplete](#16-recipient-input-with-autocomplete)
17. [Attachment Upload & Preview](#17-attachment-upload--preview)
18. [Email Filters Panel](#18-email-filters-panel)
19. [Label/Category Management](#19-labelcategory-management)
20. [Bulk Actions Toolbar](#20-bulk-actions-toolbar)
21. [Draft Auto-Save](#21-draft-auto-save)
22. [Undo/Snackbar for Actions](#22-undosnackbar-for-actions)
23. [Offline Support with Service Worker](#23-offline-support-with-service-worker)
24. [Rich Text Editor Integration](#24-rich-text-editor-integration)

---

## 1. Requirements Overview

### Functional Requirements
- **Inbox Management**: View, search, filter, and organize emails
- **Email Composition**: Rich text editor with attachments, CC/BCC, drafts
- **Folder Navigation**: Inbox, Sent, Drafts, Spam, Trash, custom folders
- **Conversation Threading**: Group related emails into threads
- **Search & Filters**: Full-text search, date filters, sender filters
- **Calendar Integration**: Meeting invites, scheduling
- **Contacts**: Address book with autocomplete
- **Labels/Categories**: Color-coded organization
- **Offline Support**: Read and compose emails offline

### Non-Functional Requirements
- **Performance**: < 2s initial load, instant folder switching
- **Scalability**: Handle 10,000+ emails per folder
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation
- **Responsive**: Desktop, tablet, and mobile layouts
- **Real-time**: Live updates for new emails

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Email Client App                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │ Sidebar  │  │  Email List  │  │     Reading Pane        │   │
│  │          │  │              │  │                         │   │
│  │ Folders  │  │  Virtual     │  │  Email Content          │   │
│  │ Labels   │  │  Scroll      │  │  Attachments            │   │
│  │ Accounts │  │  List        │  │  Actions                │   │
│  └──────────┘  └──────────────┘  └─────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      State Management (Zustand)                  │
├─────────────────────────────────────────────────────────────────┤
│  Email Store  │  Folder Store  │  UI Store  │  Search Store    │
├─────────────────────────────────────────────────────────────────┤
│                    Data Layer (TanStack Query)                   │
├─────────────────────────────────────────────────────────────────┤
│   Email API   │  Folder API   │  Search API  │  Sync Service   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Data Types

```typescript
// types/email.ts
interface Email {
  id: string;
  threadId: string;
  folderId: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  snippet: string; // Preview text
  body: EmailBody;
  attachments: Attachment[];
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isFlagged: boolean;
  isDraft: boolean;
  receivedAt: string;
  sentAt?: string;
}

interface EmailAddress {
  name: string;
  email: string;
  avatar?: string;
}

interface EmailBody {
  html: string;
  text: string;
}

interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

interface Folder {
  id: string;
  name: string;
  type: FolderType;
  icon: string;
  unreadCount: number;
  totalCount: number;
  color?: string;
  parentId?: string;
  children?: Folder[];
}

type FolderType =
  | 'inbox'
  | 'sent'
  | 'drafts'
  | 'spam'
  | 'trash'
  | 'archive'
  | 'custom';

interface Thread {
  id: string;
  emails: Email[];
  subject: string;
  participants: EmailAddress[];
  snippet: string;
  lastMessageAt: string;
  isRead: boolean;
  messageCount: number;
}
```

---

## 4. Email Store (Zustand)

```typescript
// stores/emailStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface EmailState {
  emails: Record<string, Email>;
  threads: Record<string, Thread>;
  selectedEmailId: string | null;
  selectedThreadId: string | null;
  selectedFolderId: string;

  // Actions
  setSelectedEmail: (id: string | null) => void;
  markAsRead: (ids: string[]) => void;
  toggleStar: (id: string) => void;
  moveToFolder: (ids: string[], folderId: string) => void;
  deleteEmails: (ids: string[]) => void;
}

export const useEmailStore = create<EmailState>()(
  immer((set) => ({
    emails: {},
    threads: {},
    selectedEmailId: null,
    selectedThreadId: null,
    selectedFolderId: 'inbox',

    setSelectedEmail: (id) =>
      set((state) => {
        state.selectedEmailId = id;
        if (id && state.emails[id]) {
          state.emails[id].isRead = true;
        }
      }),

    markAsRead: (ids) =>
      set((state) => {
        ids.forEach((id) => {
          if (state.emails[id]) {
            state.emails[id].isRead = true;
          }
        });
      }),

    toggleStar: (id) =>
      set((state) => {
        if (state.emails[id]) {
          state.emails[id].isStarred = !state.emails[id].isStarred;
        }
      }),

    moveToFolder: (ids, folderId) =>
      set((state) => {
        ids.forEach((id) => {
          if (state.emails[id]) {
            state.emails[id].folderId = folderId;
          }
        });
      }),

    deleteEmails: (ids) =>
      set((state) => {
        ids.forEach((id) => {
          delete state.emails[id];
        });
      }),
  }))
);
```

---

## 5. Email List Data Fetching

```typescript
// hooks/useEmails.ts
import { useInfiniteQuery } from '@tanstack/react-query';

interface EmailsResponse {
  emails: Email[];
  nextCursor: string | null;
  totalCount: number;
}

export function useEmails(folderId: string, filters?: EmailFilters) {
  return useInfiniteQuery({
    queryKey: ['emails', folderId, filters],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams({
        folderId,
        ...(pageParam && { cursor: pageParam }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.isUnread && { isUnread: 'true' }),
      });

      const res = await fetch(`/api/emails?${params}`);
      return res.json() as Promise<EmailsResponse>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 1000, // 30 seconds
  });
}
```

---

## 6. Virtual Email List Component

```tsx
// components/EmailList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect, useMemo } from 'react';

interface EmailListProps {
  folderId: string;
}

export function EmailList({ folderId }: EmailListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetching } = useEmails(folderId);

  const emails = useMemo(
    () => data?.pages.flatMap((p) => p.emails) ?? [],
    [data]
  );

  const virtualizer = useVirtualizer({
    count: hasNextPage ? emails.length + 1 : emails.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  // Load more when reaching end
  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (lastItem?.index >= emails.length - 1 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [items, emails.length, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {items.map((virtualRow) => {
          const email = emails[virtualRow.index];
          if (!email) return <LoadingRow key={virtualRow.key} />;

          return (
            <EmailRow
              key={email.id}
              email={email}
              style={{
                position: 'absolute',
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
                height: `${virtualRow.size}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

## 7. Email Row Component

```tsx
// components/EmailRow.tsx
import { memo } from 'react';
import { Star, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeDate } from '@/utils/date';

interface EmailRowProps {
  email: Email;
  style?: React.CSSProperties;
}

export const EmailRow = memo(function EmailRow({ email, style }: EmailRowProps) {
  const { setSelectedEmail, toggleStar } = useEmailStore();

  return (
    <div
      style={style}
      onClick={() => setSelectedEmail(email.id)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 cursor-pointer border-b',
        'hover:bg-gray-50 transition-colors',
        !email.isRead && 'bg-blue-50 font-semibold'
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        className="w-4 h-4 rounded"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleStar(email.id);
        }}
      >
        <Star
          className={cn(
            'w-4 h-4',
            email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
          )}
        />
      </button>

      {/* Sender */}
      <div className="w-48 truncate">{email.from.name || email.from.email}</div>

      {/* Subject & Snippet */}
      <div className="flex-1 min-w-0">
        <span className={cn(!email.isRead && 'font-semibold')}>
          {email.subject}
        </span>
        <span className="text-gray-500 ml-2">— {email.snippet}</span>
      </div>

      {/* Attachment indicator */}
      {email.attachments.length > 0 && (
        <Paperclip className="w-4 h-4 text-gray-400" />
      )}

      {/* Date */}
      <div className="text-sm text-gray-500 w-20 text-right">
        {formatRelativeDate(email.receivedAt)}
      </div>
    </div>
  );
});
```

---

## 8. Folder Sidebar Component

```tsx
// components/FolderSidebar.tsx
import { Inbox, Send, FileText, Trash, Archive, AlertCircle } from 'lucide-react';

const FOLDER_ICONS: Record<FolderType, React.ElementType> = {
  inbox: Inbox,
  sent: Send,
  drafts: FileText,
  spam: AlertCircle,
  trash: Trash,
  archive: Archive,
  custom: FileText,
};

export function FolderSidebar() {
  const { data: folders } = useFolders();
  const { selectedFolderId, setSelectedFolder } = useEmailStore();

  return (
    <aside className="w-64 border-r bg-gray-50 p-4">
      <button className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Compose
      </button>

      <nav className="space-y-1">
        {folders?.map((folder) => {
          const Icon = FOLDER_ICONS[folder.type];
          const isActive = selectedFolderId === folder.id;

          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{folder.name}</span>
              {folder.unreadCount > 0 && (
                <span className="text-sm font-medium">
                  {folder.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
```

---

## 9. Reading Pane Component

```tsx
// components/ReadingPane.tsx
import { Reply, ReplyAll, Forward, Trash, Archive, MoreHorizontal } from 'lucide-react';

export function ReadingPane() {
  const { selectedEmailId, emails } = useEmailStore();
  const email = selectedEmailId ? emails[selectedEmailId] : null;

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select an email to read
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Reply className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <ReplyAll className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Forward className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button className="p-2 hover:bg-gray-100 rounded">
          <Archive className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Trash className="w-5 h-5" />
        </button>
      </div>

      {/* Email Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-2">{email.subject}</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {email.from.name?.[0] || email.from.email[0]}
          </div>
          <div>
            <div className="font-medium">{email.from.name}</div>
            <div className="text-sm text-gray-500">{email.from.email}</div>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {formatFullDate(email.receivedAt)}
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(email.body.html) }}
        />
      </div>

      {/* Attachments */}
      {email.attachments.length > 0 && (
        <AttachmentList attachments={email.attachments} />
      )}
    </div>
  );
}
```

---

## 10. Email Search Component

```tsx
// components/EmailSearch.tsx
import { useState, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function EmailSearch() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useSearchEmails(debouncedQuery, {
    enabled: debouncedQuery.length >= 2,
  });

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emails..."
          className="flex-1 bg-transparent outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border max-h-96 overflow-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No results</div>
          ) : (
            results?.map((email) => (
              <SearchResultItem key={email.id} email={email} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 11. Email Compose Modal

```tsx
// components/ComposeModal.tsx
import { useState } from 'react';
import { X, Paperclip, Minimize2, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ComposeState {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: File[];
}

export function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  const [draft, setDraft] = useState<ComposeState>({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    attachments: [],
  });
  const [showCc, setShowCc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const sendMutation = useSendEmail();

  const handleSend = async () => {
    await sendMutation.mutateAsync(draft);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        'max-w-2xl',
        isMinimized && 'h-14 overflow-hidden'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-medium">New Message</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Recipients */}
            <div className="p-3 space-y-2 border-b">
              <RecipientInput
                label="To"
                value={draft.to}
                onChange={(to) => setDraft({ ...draft, to })}
              />
              {showCc && (
                <>
                  <RecipientInput
                    label="Cc"
                    value={draft.cc}
                    onChange={(cc) => setDraft({ ...draft, cc })}
                  />
                  <RecipientInput
                    label="Bcc"
                    value={draft.bcc}
                    onChange={(bcc) => setDraft({ ...draft, bcc })}
                  />
                </>
              )}
            </div>

            {/* Subject */}
            <input
              type="text"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Subject"
              className="w-full p-3 border-b outline-none"
            />

            {/* Body */}
            <RichTextEditor
              value={draft.body}
              onChange={(body) => setDraft({ ...draft, body })}
            />

            {/* Footer */}
            <div className="flex items-center gap-2 p-3 border-t">
              <button
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Send
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 12. Keyboard Navigation

```typescript
// hooks/useKeyboardNavigation.ts
import { useEffect, useCallback } from 'react';

const SHORTCUTS = {
  'c': 'compose',
  'r': 'reply',
  'a': 'replyAll',
  'f': 'forward',
  'e': 'archive',
  '#': 'delete',
  's': 'toggleStar',
  'u': 'markUnread',
  '/': 'search',
  'j': 'nextEmail',
  'k': 'prevEmail',
  'Enter': 'openEmail',
  'Escape': 'close',
} as const;

export function useKeyboardNavigation() {
  const {
    emails,
    selectedEmailId,
    setSelectedEmail,
    toggleStar,
    markAsRead,
  } = useEmailStore();

  const emailIds = Object.keys(emails);
  const currentIndex = selectedEmailId
    ? emailIds.indexOf(selectedEmailId)
    : -1;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const action = SHORTCUTS[e.key as keyof typeof SHORTCUTS];

    switch (action) {
      case 'nextEmail':
        if (currentIndex < emailIds.length - 1) {
          setSelectedEmail(emailIds[currentIndex + 1]);
        }
        break;
      case 'prevEmail':
        if (currentIndex > 0) {
          setSelectedEmail(emailIds[currentIndex - 1]);
        }
        break;
      case 'toggleStar':
        if (selectedEmailId) toggleStar(selectedEmailId);
        break;
      case 'search':
        e.preventDefault();
        document.getElementById('search-input')?.focus();
        break;
      // ... handle other actions
    }
  }, [currentIndex, emailIds, selectedEmailId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

---

## 13. Real-time Updates (WebSocket)

```typescript
// hooks/useEmailSync.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type EmailEvent =
  | { type: 'NEW_EMAIL'; payload: Email }
  | { type: 'EMAIL_READ'; payload: { id: string } }
  | { type: 'EMAIL_DELETED'; payload: { id: string } };

export function useEmailSync() {
  const queryClient = useQueryClient();
  const { addEmail, updateEmail, removeEmail } = useEmailStore();

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/emails/sync');

    ws.onmessage = (event) => {
      const data: EmailEvent = JSON.parse(event.data);

      switch (data.type) {
        case 'NEW_EMAIL':
          addEmail(data.payload);
          queryClient.invalidateQueries({ queryKey: ['emails'] });
          // Show notification
          showNotification({
            title: data.payload.from.name,
            body: data.payload.subject,
          });
          break;

        case 'EMAIL_READ':
          updateEmail(data.payload.id, { isRead: true });
          break;

        case 'EMAIL_DELETED':
          removeEmail(data.payload.id);
          break;
      }
    };

    ws.onclose = () => {
      // Reconnect logic
      setTimeout(() => useEmailSync(), 3000);
    };

    return () => ws.close();
  }, [queryClient]);
}

// Notification helper
function showNotification(options: { title: string; body: string }) {
  if (Notification.permission === 'granted') {
    new Notification(options.title, { body: options.body });
  }
}
```

---

## 14. Main App Layout

```tsx
// components/EmailApp.tsx
import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export function EmailApp() {
  const [composeOpen, setComposeOpen] = useState(false);
  const { selectedFolderId } = useEmailStore();

  // Initialize keyboard navigation and real-time sync
  useKeyboardNavigation();
  useEmailSync();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-4 gap-4">
        <Logo />
        <EmailSearch />
        <div className="ml-auto flex items-center gap-2">
          <SettingsButton />
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <FolderSidebar onCompose={() => setComposeOpen(true)} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={30} minSize={25}>
          <EmailList folderId={selectedFolderId} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <ReadingPane />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Compose Modal */}
      <ComposeModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} />
    </div>
  );
}
```

---

## 15. Thread View Component

```tsx
// components/ThreadView.tsx
import { useState, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ThreadViewProps {
  thread: Thread;
}

export const ThreadView = memo(function ThreadView({ thread }: ThreadViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set([thread.emails[thread.emails.length - 1].id]) // Last email expanded
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(thread.emails.map((e) => e.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set([thread.emails[thread.emails.length - 1].id]));
  };

  return (
    <div className="flex flex-col">
      {/* Thread Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">{thread.subject}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {thread.messageCount} messages
          </span>
          <button onClick={expandAll} className="text-sm text-blue-600">
            Expand all
          </button>
        </div>
      </div>

      {/* Email Messages */}
      <div className="flex-1 overflow-auto">
        {thread.emails.map((email, index) => (
          <ThreadMessage
            key={email.id}
            email={email}
            isExpanded={expandedIds.has(email.id)}
            onToggle={() => toggleExpand(email.id)}
            isLast={index === thread.emails.length - 1}
          />
        ))}
      </div>
    </div>
  );
});

// Individual thread message
function ThreadMessage({
  email,
  isExpanded,
  onToggle,
  isLast,
}: {
  email: Email;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className={cn('border-b', !email.isRead && 'bg-blue-50')}>
      {/* Collapsed Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50"
      >
        <Avatar name={email.from.name} email={email.from.email} />
        <div className="flex-1 text-left">
          <div className="font-medium">{email.from.name}</div>
          {!isExpanded && (
            <div className="text-sm text-gray-500 truncate">{email.snippet}</div>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {formatRelativeDate(email.receivedAt)}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <EmailContent email={email} />
        </div>
      )}
    </div>
  );
}
```

---

## 16. Recipient Input with Autocomplete

```tsx
// components/RecipientInput.tsx
import { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface RecipientInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function RecipientInput({ label, value, onChange }: RecipientInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedInput = useDebounce(input, 200);

  const { data: suggestions } = useContactSearch(debouncedInput, {
    enabled: debouncedInput.length >= 2,
  });

  const addRecipient = useCallback((email: string) => {
    if (!value.includes(email)) {
      onChange([...value, email]);
    }
    setInput('');
    setShowSuggestions(false);
  }, [value, onChange]);

  const removeRecipient = (email: string) => {
    onChange(value.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      if (isValidEmail(input)) {
        addRecipient(input);
      }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeRecipient(value[value.length - 1]);
    }
  };

  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-500 py-1 w-8">{label}</span>
      <div className="flex-1 flex flex-wrap gap-1 relative">
        {/* Selected Recipients */}
        {value.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {email}
            <button onClick={() => removeRecipient(email)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="flex-1 min-w-[120px] outline-none text-sm py-1"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
            {suggestions.map((contact) => (
              <button
                key={contact.email}
                onClick={() => addRecipient(contact.email)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
              >
                <Avatar name={contact.name} size="sm" />
                <div className="text-left">
                  <div className="text-sm font-medium">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## 17. Attachment Upload & Preview

```tsx
// components/AttachmentUpload.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paperclip, X, FileText, Image, File } from 'lucide-react';
import { formatFileSize } from '@/utils/format';

interface AttachmentUploadProps {
  attachments: File[];
  onChange: (files: File[]) => void;
  maxSize?: number; // bytes
  maxFiles?: number;
}

export function AttachmentUpload({
  attachments,
  onChange,
  maxSize = 25 * 1024 * 1024, // 25MB
  maxFiles = 10,
}: AttachmentUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...attachments, ...acceptedFiles].slice(0, maxFiles);
    onChange(newFiles);
  }, [attachments, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    maxFiles: maxFiles - attachments.length,
  });

  const removeFile = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />
        <Paperclip className="w-6 h-6 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max {formatFileSize(maxSize)} per file
        </p>
      </div>

      {/* File List */}
      {attachments.length > 0 && (
        <div className="space-y-1">
          {attachments.map((file, index) => (
            <AttachmentPreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AttachmentPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const Icon = getFileIcon(file.type);

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
      <Icon className="w-5 h-5 text-gray-500" />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{file.name}</div>
        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
      </div>
      <button onClick={onRemove} className="p-1 hover:bg-gray-200 rounded">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
  return File;
}
```

---

## 18. Email Filters Panel

```tsx
// components/EmailFilters.tsx
import { Calendar, User, Tag, Paperclip } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EmailFilters {
  isUnread?: boolean;
  hasAttachment?: boolean;
  from?: string;
  dateRange?: { start: Date; end: Date };
  labels?: string[];
}

interface EmailFiltersProps {
  filters: EmailFilters;
  onChange: (filters: EmailFilters) => void;
}

export function EmailFiltersPanel({ filters, onChange }: EmailFiltersProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      {/* Quick Filters */}
      <button
        onClick={() => onChange({ ...filters, isUnread: !filters.isUnread })}
        className={cn(
          'px-3 py-1 text-sm rounded-full',
          filters.isUnread ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
        )}
      >
        Unread
      </button>

      <button
        onClick={() => onChange({ ...filters, hasAttachment: !filters.hasAttachment })}
        className={cn(
          'px-3 py-1 text-sm rounded-full flex items-center gap-1',
          filters.hasAttachment ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
        )}
      >
        <Paperclip className="w-3 h-3" />
        Has attachment
      </button>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-3 py-1 text-sm rounded-full bg-gray-100 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Date
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <DateRangePicker
            value={filters.dateRange}
            onChange={(dateRange) => onChange({ ...filters, dateRange })}
          />
        </PopoverContent>
      </Popover>

      {/* From Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-3 py-1 text-sm rounded-full bg-gray-100 flex items-center gap-1">
            <User className="w-3 h-3" />
            From
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <input
            type="text"
            placeholder="Filter by sender..."
            value={filters.from || ''}
            onChange={(e) => onChange({ ...filters, from: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange({})}
          className="text-sm text-blue-600 hover:underline ml-auto"
        >
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );
}
```

---

## 19. Label/Category Management

```tsx
// components/LabelManager.tsx
import { useState } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const LABEL_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
];

interface Label {
  id: string;
  name: string;
  color: string;
}

interface LabelManagerProps {
  emailId: string;
  currentLabels: string[];
}

export function LabelManager({ emailId, currentLabels }: LabelManagerProps) {
  const { data: labels } = useLabels();
  const addLabelMutation = useAddLabel();
  const removeLabelMutation = useRemoveLabel();
  const [isCreating, setIsCreating] = useState(false);

  const toggleLabel = (labelId: string) => {
    if (currentLabels.includes(labelId)) {
      removeLabelMutation.mutate({ emailId, labelId });
    } else {
      addLabelMutation.mutate({ emailId, labelId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Tag className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {labels?.map((label) => (
          <DropdownMenuItem
            key={label.id}
            onClick={() => toggleLabel(label.id)}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="flex-1">{label.name}</span>
            {currentLabels.includes(label.id) && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}

        <div className="border-t mt-1 pt-1">
          {isCreating ? (
            <CreateLabelForm
              onComplete={() => setIsCreating(false)}
            />
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
              Create new label
            </button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CreateLabelForm({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(LABEL_COLORS[0].value);
  const createMutation = useCreateLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({ name, color });
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Label name"
        className="w-full px-2 py-1 text-sm border rounded"
        autoFocus
      />
      <div className="flex gap-1">
        {LABEL_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setColor(c.value)}
            className={cn(
              'w-6 h-6 rounded-full',
              color === c.value && 'ring-2 ring-offset-1 ring-gray-400'
            )}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={!name}
        className="w-full py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Create
      </button>
    </form>
  );
}
```

---

## 20. Bulk Actions Toolbar

```tsx
// components/BulkActionsToolbar.tsx
import { Archive, Trash, Mail, MailOpen, Tag, FolderInput } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionsToolbar({ selectedIds, onClearSelection }: BulkActionsToolbarProps) {
  const { markAsRead, markAsUnread, moveToFolder, deleteEmails } = useEmailStore();
  const moveMutation = useMoveEmails();
  const deleteMutation = useDeleteEmails();

  if (selectedIds.length === 0) return null;

  const handleArchive = () => {
    moveMutation.mutate({ ids: selectedIds, folderId: 'archive' });
    onClearSelection();
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedIds);
    onClearSelection();
  };

  const handleMarkRead = () => {
    markAsRead(selectedIds);
  };

  const handleMarkUnread = () => {
    markAsUnread(selectedIds);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b">
      <span className="text-sm font-medium text-blue-700">
        {selectedIds.length} selected
      </span>

      <div className="flex items-center gap-1 ml-4">
        <ActionButton icon={Archive} label="Archive" onClick={handleArchive} />
        <ActionButton icon={Trash} label="Delete" onClick={handleDelete} />
        <ActionButton icon={MailOpen} label="Mark read" onClick={handleMarkRead} />
        <ActionButton icon={Mail} label="Mark unread" onClick={handleMarkUnread} />

        {/* Move to folder dropdown */}
        <MoveToFolderDropdown
          selectedIds={selectedIds}
          onMoved={onClearSelection}
        />

        {/* Label dropdown */}
        <BulkLabelDropdown selectedIds={selectedIds} />
      </div>

      <button
        onClick={onClearSelection}
        className="ml-auto text-sm text-blue-600 hover:underline"
      >
        Clear selection
      </button>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-blue-100 rounded flex items-center gap-1"
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm hidden md:inline">{label}</span>
    </button>
  );
}

function MoveToFolderDropdown({
  selectedIds,
  onMoved,
}: {
  selectedIds: string[];
  onMoved: () => void;
}) {
  const { data: folders } = useFolders();
  const moveMutation = useMoveEmails();

  const handleMove = (folderId: string) => {
    moveMutation.mutate({ ids: selectedIds, folderId });
    onMoved();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-blue-100 rounded flex items-center gap-1">
          <FolderInput className="w-4 h-4" />
          <span className="text-sm hidden md:inline">Move to</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {folders?.map((folder) => (
          <DropdownMenuItem key={folder.id} onClick={() => handleMove(folder.id)}>
            {folder.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 21. Draft Auto-Save

```typescript
// hooks/useDraftAutoSave.ts
import { useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';

interface Draft {
  id?: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: string[];
  lastSaved?: Date;
}

export function useDraftAutoSave(draft: Draft, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const draftIdRef = useRef<string | undefined>(draft.id);
  const lastSavedRef = useRef<string>('');

  const debouncedDraft = useDebounce(draft, 2000);

  const saveMutation = useMutation({
    mutationFn: async (draftData: Draft) => {
      const endpoint = draftIdRef.current
        ? `/api/drafts/${draftIdRef.current}`
        : '/api/drafts';

      const method = draftIdRef.current ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData),
      });

      return res.json();
    },
    onSuccess: (data) => {
      draftIdRef.current = data.id;
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });

  // Auto-save when draft changes
  useEffect(() => {
    if (!enabled) return;

    const draftString = JSON.stringify(debouncedDraft);
    if (draftString === lastSavedRef.current) return;

    // Don't save empty drafts
    const hasContent =
      debouncedDraft.to.length > 0 ||
      debouncedDraft.subject ||
      debouncedDraft.body;

    if (!hasContent) return;

    saveMutation.mutate(debouncedDraft);
    lastSavedRef.current = draftString;
  }, [debouncedDraft, enabled]);

  const save = useCallback(() => {
    saveMutation.mutate(draft);
  }, [draft]);

  const discard = useCallback(async () => {
    if (draftIdRef.current) {
      await fetch(`/api/drafts/${draftIdRef.current}`, { method: 'DELETE' });
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    }
  }, [queryClient]);

  return {
    draftId: draftIdRef.current,
    isSaving: saveMutation.isPending,
    lastSaved: saveMutation.data?.updatedAt,
    save,
    discard,
  };
}
```

```tsx
// Usage in ComposeModal
function ComposeModal() {
  const [draft, setDraft] = useState<Draft>({ ... });

  const { isSaving, lastSaved, discard } = useDraftAutoSave(draft);

  return (
    <Dialog>
      {/* ... compose form */}

      <div className="flex items-center text-xs text-gray-500">
        {isSaving ? (
          <span>Saving...</span>
        ) : lastSaved ? (
          <span>Saved at {format(lastSaved, 'HH:mm')}</span>
        ) : null}
      </div>
    </Dialog>
  );
}
```

---

## 22. Undo/Snackbar for Actions

```tsx
// components/UndoSnackbar.tsx
import { useEffect, useState } from 'react';
import { X, Undo2 } from 'lucide-react';
import { create } from 'zustand';

interface UndoAction {
  id: string;
  message: string;
  undo: () => void | Promise<void>;
  createdAt: number;
  duration?: number;
}

interface UndoStore {
  actions: UndoAction[];
  addAction: (action: Omit<UndoAction, 'id' | 'createdAt'>) => void;
  removeAction: (id: string) => void;
  clearAll: () => void;
}

export const useUndoStore = create<UndoStore>((set) => ({
  actions: [],
  addAction: (action) =>
    set((state) => ({
      actions: [
        ...state.actions,
        {
          ...action,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        },
      ],
    })),
  removeAction: (id) =>
    set((state) => ({
      actions: state.actions.filter((a) => a.id !== id),
    })),
  clearAll: () => set({ actions: [] }),
}));

export function UndoSnackbar() {
  const { actions, removeAction } = useUndoStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {actions.map((action) => (
        <SnackbarItem
          key={action.id}
          action={action}
          onDismiss={() => removeAction(action.id)}
        />
      ))}
    </div>
  );
}

function SnackbarItem({
  action,
  onDismiss,
}: {
  action: UndoAction;
  onDismiss: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(action.duration || 5000);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          onDismiss();
          return 0;
        }
        return t - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, onDismiss]);

  const handleUndo = async () => {
    await action.undo();
    onDismiss();
  };

  const progress = (timeLeft / (action.duration || 5000)) * 100;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden"
    >
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all"
        style={{ width: `${progress}%` }}
      />

      <span className="text-sm">{action.message}</span>

      <button
        onClick={handleUndo}
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-400 hover:text-blue-300"
      >
        <Undo2 className="w-4 h-4" />
        Undo
      </button>

      <button onClick={onDismiss} className="p-1 hover:bg-gray-700 rounded">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Usage with email actions
function useEmailActions() {
  const { addAction } = useUndoStore();
  const queryClient = useQueryClient();

  const deleteEmail = async (emailId: string) => {
    // Store email for potential undo
    const email = queryClient.getQueryData<Email>(['email', emailId]);

    // Optimistic delete
    await fetch(`/api/emails/${emailId}`, { method: 'DELETE' });

    // Show undo snackbar
    addAction({
      message: 'Email deleted',
      undo: async () => {
        await fetch('/api/emails/restore', {
          method: 'POST',
          body: JSON.stringify({ id: emailId }),
        });
        queryClient.invalidateQueries({ queryKey: ['emails'] });
      },
    });
  };

  return { deleteEmail };
}
```

---

## 23. Offline Support with Service Worker

```typescript
// service-worker.ts
const CACHE_NAME = 'email-client-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
];

// Install - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;

  // API requests - network first, cache fallback
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets - cache first
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error('No cached data available');
  }
}
```

```typescript
// hooks/useOfflineQueue.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QueuedAction {
  id: string;
  type: 'send' | 'delete' | 'move' | 'read';
  payload: Record<string, unknown>;
  createdAt: number;
}

interface OfflineStore {
  isOnline: boolean;
  queue: QueuedAction[];
  setOnline: (online: boolean) => void;
  addToQueue: (action: Omit<QueuedAction, 'id' | 'createdAt'>) => void;
  removeFromQueue: (id: string) => void;
  processQueue: () => Promise<void>;
}

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      isOnline: navigator.onLine,
      queue: [],

      setOnline: (online) => set({ isOnline: online }),

      addToQueue: (action) =>
        set((state) => ({
          queue: [
            ...state.queue,
            { ...action, id: crypto.randomUUID(), createdAt: Date.now() },
          ],
        })),

      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((a) => a.id !== id),
        })),

      processQueue: async () => {
        const { queue, removeFromQueue } = get();

        for (const action of queue) {
          try {
            await processAction(action);
            removeFromQueue(action.id);
          } catch (error) {
            console.error('Failed to process queued action:', error);
          }
        }
      },
    }),
    { name: 'email-offline-queue' }
  )
);

// Process queued actions when online
async function processAction(action: QueuedAction) {
  const endpoints: Record<string, string> = {
    send: '/api/emails/send',
    delete: '/api/emails/delete',
    move: '/api/emails/move',
    read: '/api/emails/read',
  };

  await fetch(endpoints[action.type], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action.payload),
  });
}
```

```tsx
// components/OfflineIndicator.tsx
export function OfflineIndicator() {
  const { isOnline, queue } = useOfflineStore();

  useEffect(() => {
    const handleOnline = () => useOfflineStore.getState().setOnline(true);
    const handleOffline = () => useOfflineStore.getState().setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process queue when back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      useOfflineStore.getState().processQueue();
    }
  }, [isOnline, queue.length]);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-center py-1 text-sm z-50">
      You're offline. Changes will sync when connected.
      {queue.length > 0 && ` (${queue.length} pending)`}
    </div>
  );
}
```

---

## 24. Rich Text Editor Integration

```tsx
// components/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your message...',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
        <ToolbarButton
          icon={Bold}
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={Italic}
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={Underline}
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          icon={Strikethrough}
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={List}
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={ListOrdered}
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <LinkButton editor={editor} />
        <ImageButton editor={editor} />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={Undo}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          icon={Redo}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  isActive,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-2 rounded hover:bg-gray-200 disabled:opacity-50',
        isActive && 'bg-gray-200'
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function LinkButton({ editor }: { editor: Editor }) {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState('');

  const setLink = () => {
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowInput(false);
    setUrl('');
  };

  return (
    <Popover open={showInput} onOpenChange={setShowInput}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('link') && 'bg-gray-200'
          )}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={setLink}
            className="w-full py-1 bg-blue-600 text-white rounded text-sm"
          >
            Add Link
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

---

This completes the **Email Client (Microsoft Outlook)** frontend system design document with 24 sections covering the critical frontend architecture patterns, components, and implementation strategies for building a production-grade email client.

