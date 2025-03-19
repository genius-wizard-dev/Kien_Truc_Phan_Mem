package source.Decorator;

public abstract class BorrowDecorator implements Borrowable {
  protected Borrowable borrowable;

  public BorrowDecorator(Borrowable borrowable) {
    this.borrowable = borrowable;
  }
}
