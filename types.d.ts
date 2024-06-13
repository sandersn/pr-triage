type Pulls = { [s: string]: Pull };
type Pull = {
  author: string;
  reviewers: string[];
  suggested: string[];
  title: string;
  body: string;
  bugbodies: string[];
  files: string[];
  /**
   * multiline notes
   * not freeform for now -- one bullet point per entry.
   */
  notes: string[];
  status: "not-started" | "review" | "waiting" | "merge" | "done";
  label:
    | "milestone"
    | "backlog"
    | "bonus"
    | "housekeeping"
    | "experiment"
    | "OTHER";
  id: string;
  lastCommit: string;
  lastComment: string;
  lastCommenter: string | undefined;
  lastReview: string;
  lastReviewer: string | undefined;
};

type Card = {
  number: string;
  title: string;
  body: string;
  suggestedReviewers: Array<{ reviewer: { login: string } }>;
  closingIssuesReferences: {
    nodes: Array<{ body: string }>;
  };
  files: {
    nodes: Array<{ path: string }>;
  };
  labels: {
    nodes: Array<{ name: string }>;
  };
  assignees: {
    nodes: Array<{ login: string }>;
  };
  author: { login: string };
  commits: {
    nodes: Array<{ commit: { committedDate: string } }>;
  };
  comments: {
    nodes: Array<{ publishedAt: string; author: { login: string } }>;
  };
  reviews: {
    nodes: Array<{ publishedAt: string; author: { login: string } }>;
  };
};

type Column = {
  name: Pull["status"];
  cards: Array<Card & { id: string }>;
};
type Board = {
  repository: {
    projectV2: {
      items: {
        pageInfo: {
          startCursor: string;
          endCursor: string;
          hasNextPage: boolean;
        };
        nodes: Array<{
          id: string;
          fieldValueByName: { id: string; name: string };
          content: Card;
        }>;
      };
    };
  };
};
