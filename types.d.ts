type Pulls = { [s: string]: Pull }
type Pull = {
    reviewer: "ahejlsberg" | "amcasey" | "andrewbranch" | "elibarzilay" | "weswigham" | "RyanCavanaugh" | "shkamat" | "sandersn" | "orta"
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
