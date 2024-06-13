type Pulls = { [s: string]: Pull }
type Pull = {
  author: string
  reviewers: string[]
  /** 1-line description */
  description: string
  /**
   * multiline notes
   * not freeform for now -- one bullet point per entry.
   */
  notes: string[]
  // TODO: SHould be status to match projectV2 terminology
  state: "not-started" | "review" | "waiting" | "merge" | "done"
  label: "milestone" | "backlog" | "bonus" | "housekeeping" | "experiment" | "OTHER"
  id: string
  lastCommit: string
  lastComment: string
  lastCommenter: string | undefined
  lastReview: string
  lastReviewer: string | undefined
}

type Card = {
  url: string
  number: string
  title: string
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
    nodes: Array<{ publishedAt: string, author: { login: string } }>
  }
  reviews: {
    nodes: Array<{ publishedAt: string, author: { login: string } }>
  }
}

// TODO: Organising by column might not make sense anymore
type Column = {
  // TODO: Probably not needed
  name: Pull["state"],
  cards: {
    // TODO: This level of nesting shouldn't be needed
    nodes: Card[]
  }
}
type Board = {
  repository: {
    projectV2: {
      items: {
        pageInfo: { startCursor: string, endCursor: string, hasNextPage: boolean, },
        nodes: Array<{
          fieldValueByName: { name: string }
          content: Card
        }>
      }
    }
  }
}
