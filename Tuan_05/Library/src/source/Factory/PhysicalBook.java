package source.Factory;

public class PhysicalBook extends Book {
  public PhysicalBook(String title, String author, String genre) {
    this.title = title;
    this.author = author;
    this.genre = genre;
  }

  public void displayInfo() {
    System.out.println("Physical Book: " + title + " by " + author);
  }
}
