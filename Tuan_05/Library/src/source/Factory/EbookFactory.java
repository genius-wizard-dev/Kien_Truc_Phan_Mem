package source.Factory;

public class EbookFactory implements BookFactory {
  public Book createBook(String title, String author, String genre) {
    return new Ebook(title, author, genre);
  }
}
