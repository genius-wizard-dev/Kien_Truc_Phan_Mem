package source;

public class File implements FileSystem {
  private String name;
  private int size;

  public File(String name, int size) {
    this.name = name;
    this.size = size;
  }

  @Override
  public void showDetail() {
    System.out.println("\t\tFile Name: " + name + " (" + size + " KB)");

  }

}
