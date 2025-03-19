package source.Factory;

public abstract class Book {
  protected String title;
  protected String author;
  protected String genre;

  public abstract void displayInfo();

  public String getTitle() {
    return title;
  }

  public String getAuthor() {
    return author;
  }

  public String getGenre() {
    return genre;
  }
}
