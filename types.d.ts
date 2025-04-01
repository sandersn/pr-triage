export type Pulls = { [s: string]: Pull }
export type RawPull = {
  id: string
  number: number
  title: string
  body: string
  // bugbodies: Array<{ body: string }>; // TODO for more info
  files: { nodes: Array<{ path: string }> } // TODO: not sure how useful this is for first pass
  author: { login: string }
  createdAt: string
  updatedAt: string
  labels: { nodes: Array<{ name: string }> }
  comments: {
    nodes: Array<{
      publishedAt: string
      body: string
      author: { login: string }
    }>
  }
  reviews: {
    nodes: Array<{
      publishedAt: string
      state: string
      author: { login: string }
    }>
  }
}
export type Pull = {
  id: string
  number: number
  title: string
  body: string
  files: string[]
  author: string
  createdAt: Date
  updatedAt: Date
  labels: string[]
  lastComment?: {
    publishedAt: Date
    body: string
    author: string
  }
  reviews: Array<{
    publishedAt: Date
    state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED"
    author: string
  }>
}

export type OldPull = {
  author: string
  reviewers: string[]
  suggested: string[]
  title: string
  body: string
  bugbodies: string[]
  files: string[]
  /**
   * multiline notes
   * not freeform for now -- one bullet point per entry.
   */
  notes: string[]
  status: "not-started" | "review" | "waiting" | "merge" | "done"
  label: "milestone" | "backlog" | "bonus" | "housekeeping" | "experiment" | "OTHER"
  id: string
  lastCommit: string
  lastComment: string
  lastCommenter: string | undefined
  lastReview: string
  lastReviewer: string | undefined
}

export type Card = {
  number: string
  title: string
  body: string
  suggestedReviewers: Array<{ reviewer: { login: string } }>
  closingIssuesReferences: {
    nodes: Array<{ body: string }>
  }
  files: {
    nodes: Array<{ path: string }>
  }
  labels: {
    nodes: Array<{ name: string }>
  }
  assignees: {
    nodes: Array<{ login: string }>
  }
  author: { login: string }
  commits: {
    nodes: Array<{ commit: { committedDate: string } }>
  }
  comments: {
    nodes: Array<{ publishedAt: string; author: { login: string } }>
  }
  reviews: {
    nodes: Array<{ publishedAt: string; author: { login: string } }>
  }
}

export type Column = {
  name: OldPull["status"]
  cards: Array<Card & { id: string }>
}
export type Board = {
  repository: {
    projectV2: {
      items: {
        pageInfo: {
          startCursor: string
          endCursor: string
          hasNextPage: boolean
        }
        nodes: Array<{
          id: string
          fieldValueByName: { id: string; name: string }
          content: Card
        }>
      }
    }
  }
}
