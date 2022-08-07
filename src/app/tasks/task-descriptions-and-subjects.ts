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
    REGULAR_GRAPHS: "Regular Graphs",
    MAX_CLIQUE: "Max Clique Problem",
    MAX_INDEPENDENT_SET: "Max Independent Set Problem",
    MIN_VERTEX_COVER: "Min Vertex Cover",
    EULER_CYCLE: "Euler Cycle",
    HAMILTON_CYCLE: "Hamilton Cycle",
    MIN_SPANNING_TREE: "Minimum Spanning Tree"
  };

  public static DESCRIPTIONS: Record<string, string> = {
    BFS_VERTEX_SELECTION: "Select all vertices in the order they are visited using the BFS algorithm.",
    DFS_VERTEX_SELECTION: "Select all vertices in the order they are visited using the DFS algorithm.",
    MAX_CLIQUE_VERTEX_SELECTION: "Select vertices which make the max clique (ore one of them) in the following graph.",
    MAX_INDEPENDENT_SET_VERTEX_SELECTION: "Select vertices which make the max independent set (ore one of them) in the following graph.",
    MIN_VERTEX_COVER_VERTEX_SELECTION: "Select vertices which make the min vertex cover (ore one of them) in the following graph.",
    COMPLETE_GRAPHS_DRAW: "Draw the following graph: K {}",
    PATH_GRAPHS_DRAW: "Draw the following graph: P {}",
    CYCLE_GRAPHS_DRAW: "Draw the following graph: C {}",
    STAR_GRAPHS_DRAW: "Draw the following graph: S {}",
    WHEEL_GRAPHS_DRAW: "Draw the following graph: W {}",
    HYPERCUBES_DRAW: "Draw the following graph: Q {}",
    REGULAR_GRAPHS_DRAW: "Draw a {k}-regular graph with {} vertices.",
    EULER_CYCLE_VERTEX_SELECTION: "Select the vertices in order they are visited when traversing the Euler Cycle in the given graph.",
    EULER_CYCLE_EDGE_SELECTION: "Select the edges in order they are visited when traversing the Euler Cycle in the given graph.",
    EULER_CYCLE_BOOLEAN: "Does the following graph contain an Euler Cycle?",
    HAMILTON_CYCLE_VERTEX_SELECTION: "Select vertices in such order, that they form a Hamilton Cycle.",
    MIN_SPANNING_TREE_EDGE_SELECTION: "Select the edges of the Minimum Spanning Tree."
  };

}
