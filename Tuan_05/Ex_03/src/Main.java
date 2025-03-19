import source.Investor;
import source.Stock;

public class Main {
  public static void main(String[] args) {
    Stock stock = new Stock("AAPL", 150.0f);
    Investor investor1 = new Investor("Investor 1");
    Investor investor2 = new Investor("Investor 2");

    stock.registerObserver(investor1);
    stock.registerObserver(investor2);

    stock.setPrice(100.5f);
    stock.setPrice(200.0f);
    stock.setPrice(300.0f);
  }
}
