package Bai_02;

interface TaxStrategy {
  double calculateTax(double price);
}

class VATStrategy implements TaxStrategy {
  public double calculateTax(double price) {
    return price * 0.1;
  }
}

class LuxuryTaxStrategy implements TaxStrategy {
  public double calculateTax(double price) {
    return price * 0.2 + 50;
  }
}

class Product {
  private TaxStrategy taxStrategy;

  public void setTaxStrategy(TaxStrategy strategy) {
    this.taxStrategy = strategy;
  }

  public double calculateTotal(double price) {
    return price + taxStrategy.calculateTax(price);
  }
}

public class Strategy {
  public static void main(String[] args) {
    // Create a product
    Product product = new Product();

    TaxStrategy vatStrategy = new VATStrategy();
    TaxStrategy luxuryTaxStrategy = new LuxuryTaxStrategy();

    double price = 1000;

    product.setTaxStrategy(vatStrategy);
    double totalWithVAT = product.calculateTotal(price);
    System.out.println("Product price: " + price);
    System.out.println("Total with VAT: " + totalWithVAT);

    product.setTaxStrategy(luxuryTaxStrategy);
    double totalWithLuxuryTax = product.calculateTotal(price);
    System.out.println("Total with Luxury Tax: " + totalWithLuxuryTax);
  }
}
