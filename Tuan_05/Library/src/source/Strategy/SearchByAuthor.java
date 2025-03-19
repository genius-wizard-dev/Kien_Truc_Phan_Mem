package source.Strategy;

import java.util.List;
import java.util.stream.Collectors;

import source.Factory.Book;

public class SearchByAuthor implements SearchStrategy {
  public List<Book> search(List<Book> books, String query) {
    return books.stream()
        .filter(book -> book.getAuthor().contains(query))
        .collect(Collectors.toList());
  }
}
