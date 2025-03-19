package source;

import java.util.ArrayList;
import java.util.List;

public class Stock implements Subject {
  private String name;
  private float price;
  private List<Observer> observers = new ArrayList<>();

  public Stock() {
  }

  public Stock(String name) {
    this.name = name;
  }

  public Stock(String name, float price) {
    this.name = name;
    this.price = price;
  }

  public void setPrice(float price) {
    this.price = price;
    notifyObservers();
  }

  @Override
  public void notifyObservers() {
    for (Observer observer : observers) {
      observer.update(price);
    }

  }

  @Override
  public void registerObserver(Observer o) {
    observers.add(o);
  }

  @Override
  public void removeObserver(Observer o) {
  }

  @Override
  public String toString() {
    return "Stock [name=" + name + ", price=" + price + ", observers=" + observers + "]";
  }

}
