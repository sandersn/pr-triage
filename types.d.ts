type Reviewer = "anders" | "andrew-branch" | "andrew-casey" | "mine" | "orta" | "ron" | "ryan" | "sheetal" | "wesley" | "nathan" | "daniel" | "sokra" | "gabriela" | "jake" | "armando"

type Pulls = { [s: string]: Pull }
type Pull = {
  author: { name: string }
  reviewers: Reviewer[]
  /** 1-line description */
  description: string
  /**
   * multiline notes
   * not freeform for now -- one bullet point per entry.
   */
  notes: string[]
  state: "not-started" | "review" | "waiting" | "merge" | "done"
  label: "milestone" | "backlog" | "bonus" | "housekeeping" | "experiment" | "OTHER"
  id: string
}

type Card = {
  number: string
  title: string
  labels: {
    nodes: Array<{ name: string }>
  }
  assignees: {
    nodes: Array<{ name: string }>
  }
  author: { name: string }
}

type Board = {
  repository: {
    project: {
      columns: {
        nodes: Array<{
          name: string,
          cards: {
            nodes: Array<{ url: string, content: Card }>
          }
        }>
      }
    }
  }
}
