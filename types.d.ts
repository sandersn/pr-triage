type Pulls = { [s: string]: Pull }
type Pull = {
    reviewer: "anders" | "andrew-branch" | "andrew-casey" | "eli" | "mine" | "orta" | "ron" | "ryan" | "sheetal" | "wesley" | "nathan" | "daniel"
    /** 1-line description */
    description: string
    /**
     * multiline notes
     * not freeform for now -- one bullet point per entry.
     */
    notes: string[]
    state: "not-started" | "review" | "waiting" | "merge" | "done"
    label: "milestone" | "backlog" | "bonus" | "housekeeping" | "experiment"
    flags?: "fix" | "feature" | "bonus"
}

type Board = {
  data: {
    repository: {
      project: {
        columns: {
          nodes: Array<{
            name: string,
            cards: {
              nodes: Array<{
                content: {
                  number: string,
                  title: string,
                  labels: {
                    nodes: Array<{
                      name: string
                    }>
                  }
                  assignees: {
                    nodes: Array<{
                      name: string
                    }>
                  }
                }
              }>
            },
          }>
        }
      }
    }
  }
}
