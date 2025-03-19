package source.Strategy;

import java.util.List;

import source.Factory.Book;
import source.Singleton.Library;

public class LibrarySearch {
  private SearchStrategy strategy;

  public void setSearchStrategy(SearchStrategy strategy) {
    this.strategy = strategy;
  }

  public List<Book> performSearch(String query) {
    return strategy.search(Library.getInstance().getBooks(), query);
  }
}
