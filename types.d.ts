type Pulls = { [s: string]: Pull }
type Pull = {
    reviewer: "anders" | "andrew-branch" | "andrew-casey" | "eli" | "mine" | "orta" | "ron" | "ryan" | "sheetal" | "wesley"
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
