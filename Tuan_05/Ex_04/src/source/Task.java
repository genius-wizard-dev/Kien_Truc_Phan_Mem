package source;

import java.util.ArrayList;
import java.util.List;

public class Task implements Subject {
  private TaskStatus taskStatus;
  private List<Observer> observers = new ArrayList<>();

  public Task() {
    this.taskStatus = TaskStatus.TO_DO;
  }

  public void setTaskStatus(TaskStatus taskStatus) {
    this.taskStatus = taskStatus;
    notifyObservers(taskStatus.toString());
  }

  @Override
  public void addObserver(Observer observer) {
    observers.add(observer);
  }

  @Override
  public void notifyObservers(String taskStatus) {
    for (Observer observer : observers) {
      observer.updateTask(taskStatus);
    }
  }

  @Override
  public void removeObserver(Observer observer) {
    observers.remove(observer);
  }

  @Override
  public String toString() {
    return "Task [taskStatus=" + taskStatus + ", observers=" + observers + "]";
  }

}
