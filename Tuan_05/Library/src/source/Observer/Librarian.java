package source.Observer;

public class Librarian implements Observer {
  private String name;

  public Librarian(String name) {
    this.name = name;
  }

  public void update(String message) {
    System.out.println("Notification to " + name + ": " + message);
  }
}
