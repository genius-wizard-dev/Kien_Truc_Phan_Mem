package source;

public class Investor implements Observer {
  private String name;

  public Investor(String name) {
    this.name = name;
  }

  @Override
  public void update(float price) {
    System.out.println("Investor " + name + " notified. New price: " + price);
  }

}
