package source;

public class Members implements Observer {
  private String name;

  public Members(String name) {
    this.name = name;
  }

  @Override
  public void updateTask(String taskStatus) {
    System.out.println("Member " + name + " has been notified of task status change: " + taskStatus);
  }

}
