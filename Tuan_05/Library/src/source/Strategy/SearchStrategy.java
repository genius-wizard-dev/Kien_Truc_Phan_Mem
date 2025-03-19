package source.Strategy;

import java.util.List;

import source.Factory.Book;

public interface SearchStrategy {
  List<Book> search(List<Book> books, String query);
}
