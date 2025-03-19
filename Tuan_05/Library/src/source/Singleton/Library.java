package source.Singleton;

import java.util.ArrayList;
import java.util.List;

import source.Factory.Book;
import source.Observer.Observer;

public class Library {
  private static Library instance;
  private List<Book> books;
  private List<Observer> observers;

  private Library() {
    books = new ArrayList<>();
    observers = new ArrayList<>();
  }

  public static Library getInstance() {
    if (instance == null) {
      instance = new Library();
    }
    return instance;
  }

  public void addBook(Book book) {
    books.add(book);
    notifyObservers("New book added: " + book.getTitle());
  }

  public List<Book> getBooks() {
    return books;
  }

  public void registerObserver(Observer observer) {
    observers.add(observer);
  }

  public void notifyObservers(String message) {
    for (Observer observer : observers) {
      observer.update(message);
    }
  }
}
