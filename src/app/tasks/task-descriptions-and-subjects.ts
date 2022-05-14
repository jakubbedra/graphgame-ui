export class TaskDescriptionsAndSubjects {

  //todo: do a hashmap instead???? will then not require switch case

  public static ;

  //variable naming convention: <subject><type>
  /*
  public static BFS_VERTEX_SELECTION = `
  Select all vertices of the given graph in the order corresponding to BFS algorithm.
  `;

  public static COMPLETE_GRAPHS_DRAW = `
  Draw the following graph: C {}
  `;
*/

  public static SUBJECTS: Record<string, string> = {
    BFS: "Breadth-First Search",
    COMPLETE_GRAPHS: "Complete Graphs"
  };

  public static DESCRIPTIONS: Record<string, string> = {
    BFS_VERTEX_SELECTION: "Select all vertices of the given graph in the order corresponding to BFS algorithm.",
    COMPLETE_GRAPHS_DRAW: "Draw the following graph: C {}"
  };

}
