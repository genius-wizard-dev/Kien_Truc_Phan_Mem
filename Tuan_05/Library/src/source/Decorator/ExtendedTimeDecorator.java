package source.Decorator;

public class ExtendedTimeDecorator extends BorrowDecorator {
  public ExtendedTimeDecorator(Borrowable borrowable) {
    super(borrowable);
  }

  public String borrow() {
    return borrowable.borrow() + " with extended time";
  }

  public double getCost() {
    return borrowable.getCost() + 2.0;
  }
}
