import source.File;
import source.Folder;

public class Main {
  public static void main(String[] args) {
    // Tạo các tập tin
    File file1 = new File("Document.txt", 120);
    File file2 = new File("Image.jpg", 450);
    File file3 = new File("Video.mp4", 1024);

    // Tạo thư mục con
    Folder subFolder1 = new Folder("\tSub_Folder_01");
    subFolder1.addFileSystem(file1); // Thêm file vào thư mục con

    Folder subFolder2 = new Folder("\tSub_Folder_02");
    subFolder2.addFileSystem(file2); // Thêm file vào thư mục con

    // Tạo thư mục chính và thêm thành phần vào đó
    Folder mainFolder = new Folder("Main_Folder");
    mainFolder.addFileSystem(subFolder1); // Thêm thư mục con vào thư mục chính
    mainFolder.addFileSystem(subFolder2); // Thêm thư mục con vào thư mục chính
    mainFolder.addFileSystem(file3); // Thêm file trực tiếp vào thư mục chính

    // Hiển thị cấu trúc cây của hệ thống quản lý tập tin/thư mục
    mainFolder.showDetail();
  }
}
