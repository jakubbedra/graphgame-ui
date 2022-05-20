export class TaskDescriptionsAndSubjects {


  public static SUBJECTS: Record<string, string> = {
    BFS: "Breadth-First Search",
    DFS: "Depth-First Search",
    COMPLETE_GRAPHS: "Complete Graphs"
  };

  public static DESCRIPTIONS: Record<string, string> = {
    BFS_VERTEX_SELECTION: "Select all vertices in the order they are visited using the BFS algorithm.",
    DFS_VERTEX_SELECTION: "Select all vertices in the order they are visited using the DFS algorithm.",
    COMPLETE_GRAPHS_DRAW: "Draw the following graph: K {}"
  };

}
