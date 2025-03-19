package source.Decorator;

public class SpecialEditionDecorator extends BorrowDecorator {
  public SpecialEditionDecorator(Borrowable borrowable) {
    super(borrowable);
  }

  public String borrow() {
    return borrowable.borrow() + " (special edition)";
  }

  public double getCost() {
    return borrowable.getCost() + 3.0;
  }
}
