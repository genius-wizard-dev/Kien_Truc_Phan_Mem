import source.Task;
import source.TaskStatus;

public class Main {
  public static void main(String[] args) throws Exception {
    Task task = new Task();
    task.addObserver(new source.Members("John"));
    task.addObserver(new source.Members("Jane"));
    task.addObserver(new source.Members("Doe"));
    task.setTaskStatus(TaskStatus.IN_PROGRESS);
    task.setTaskStatus(TaskStatus.DONE);
  }
}
