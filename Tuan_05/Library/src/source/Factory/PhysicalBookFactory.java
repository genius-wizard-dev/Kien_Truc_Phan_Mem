package source.Factory;

public class PhysicalBookFactory implements BookFactory {
  public Book createBook(String title, String author, String genre) {
    return new PhysicalBook(title, author, genre);
  }
}
