import java.util.List;

import source.Decorator.BasicBorrow;
import source.Decorator.Borrowable;
import source.Decorator.ExtendedTimeDecorator;
import source.Decorator.SpecialEditionDecorator;
import source.Factory.Book;
import source.Factory.BookFactory;
import source.Factory.PhysicalBookFactory;
import source.Observer.Librarian;
import source.Singleton.Library;
import source.Strategy.LibrarySearch;
import source.Strategy.SearchByTitle;

public class Main {
  public static void main(String[] args) {
    // Singleton
    Library library = Library.getInstance();

    // Factory Method
    BookFactory physicalFactory = new PhysicalBookFactory();
    Book book = physicalFactory.createBook("The Book", "Author", "Fiction");
    library.addBook(book);

    // Observer
    Librarian librarian = new Librarian("John");
    library.registerObserver(librarian);

    // Strategy
    LibrarySearch search = new LibrarySearch();
    search.setSearchStrategy(new SearchByTitle());
    List<Book> results = search.performSearch("The");
    System.out.println("Search results: " + results.size() + " book(s) found.");

    // Decorator
    Borrowable basicBorrow = new BasicBorrow(book);
    Borrowable extendedBorrow = new ExtendedTimeDecorator(basicBorrow);
    Borrowable specialBorrow = new SpecialEditionDecorator(extendedBorrow);
    System.out.println(specialBorrow.borrow());
    System.out.println("Cost: " + specialBorrow.getCost());
  }
}
