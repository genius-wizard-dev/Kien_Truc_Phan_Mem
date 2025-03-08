package Bai_02;

interface PaymentMethod {
  void pay(double amount);
}

class CreditCardPayment implements PaymentMethod {
  public void pay(double amount) {
    System.out.println("Thanh toán $" + amount + " bằng thẻ tín dụng");
  }
}

class PayPalPayment implements PaymentMethod {
  public void pay(double amount) {
    System.out.println("Thanh toán $" + amount + " bằng PayPal");
  }
}

abstract class PaymentDecorator implements PaymentMethod {
  protected PaymentMethod wrapped;

  public PaymentDecorator(PaymentMethod method) {
    this.wrapped = method;
  }
}

class ProcessingFeeDecorator extends PaymentDecorator {
  public ProcessingFeeDecorator(PaymentMethod method) {
    super(method);
  }

  public void pay(double amount) {
    double total = amount + 2.5;
    wrapped.pay(total);
  }
}

class DiscountDecorator extends PaymentDecorator {
  private double discountRate;

  public DiscountDecorator(PaymentMethod method, double discountRate) {
    super(method);
    this.discountRate = discountRate;
  }

  public void pay(double amount) {
    double discount = amount * discountRate;
    double total = amount - discount;
    System.out.println("Áp dụng giảm giá: -$" + discount);
    wrapped.pay(total);
  }
}

public class Decoration {
  public static void main(String[] args) {
    PaymentMethod creditCardPayment = new CreditCardPayment();
    System.out.println("Thanh toán cơ bản:");
    creditCardPayment.pay(100.0);

    PaymentMethod withProcessingFee = new ProcessingFeeDecorator(new CreditCardPayment());
    System.out.println("\nThanh toán với phí xử lý:");
    withProcessingFee.pay(100.0);

    PaymentMethod complexPayment = new ProcessingFeeDecorator(
        new DiscountDecorator(new PayPalPayment(), 0.1));
    System.out.println("\nThanh toán phức tạp (PayPal + giảm giá 10% + phí xử lý):");
    complexPayment.pay(100.0);
  }
}
