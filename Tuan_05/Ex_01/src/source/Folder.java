package source;

import java.util.ArrayList;
import java.util.List;

public class Folder implements FileSystem {
  private String name;
  private List<FileSystem> fileSystems = new ArrayList<>();

  public Folder(String name) {
    this.name = name;
  }

  public void addFileSystem(FileSystem fileSystem) {
    fileSystems.add(fileSystem);
  }

  public void removeFileSystem(FileSystem fileSystem) {
    fileSystems.remove(fileSystem);
  }

  @Override
  public void showDetail() {
    System.out.println(name);
    for (FileSystem fileSystem : fileSystems) {
      fileSystem.showDetail();
    }
  }

}
