export class TaskDescriptionsAndSubjects {


  public static SUBJECTS: Record<string, string> = {
    BFS: "Breadth-First Search",
    DFS: "Depth-First Search",
    COMPLETE_GRAPHS: "Complete Graphs",
    PATH_GRAPHS: "Path Graphs",
    CYCLE_GRAPHS: "Cycle Graphs",
    STAR_GRAPHS: "Star Graphs",
    WHEEL_GRAPHS: "Wheel Graphs",
    HYPERCUBES: "Hypercubes",
    REGULAR_GRAPHS: "Regular Graphs"
  };

  public static DESCRIPTIONS: Record<string, string> = {
    BFS_VERTEX_SELECTION: "Select all vertices in the order they are visited using the BFS algorithm.",
    DFS_VERTEX_SELECTION: "Select all vertices in the order they are visited using the DFS algorithm.",
    COMPLETE_GRAPHS_DRAW: "Draw the following graph: K {}",
    PATH_GRAPHS_DRAW: "Draw the following graph: P {}",
    CYCLE_GRAPHS_DRAW: "Draw the following graph: C {}",
    STAR_GRAPHS_DRAW: "Draw the following graph: S {}",
    WHEEL_GRAPHS_DRAW: "Draw the following graph: W {}",
    HYPERCUBES_DRAW: "Draw the following graph: Q {}",
    REGULAR_GRAPHS_DRAW: "Draw a {k}-regular graph with {} vertices."
};

}
