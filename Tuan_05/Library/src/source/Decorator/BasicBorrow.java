package source.Decorator;

import source.Factory.Book;

public class BasicBorrow implements Borrowable {
  private Book book;

  public BasicBorrow(Book book) {
    this.book = book;
  }

  public String borrow() {
    return "Borrowed: " + book.getTitle();
  }

  public double getCost() {
    return 5.0; // Giá cơ bản
  }
}
