package source;

public class DataFormatAdapter {
  private XML xmlSystem;

  public DataFormatAdapter() {
    this.xmlSystem = new XML();
  }

  // XML sang JSON đơn giản
  public String xmlToJson(String xmlString) {
    // Chuyển đổi cơ bản: thay thế tag XML bằng cú pháp JSON
    String json = xmlString
        .replaceAll("<name>", "\"name\": \"")
        .replaceAll("</name>", "\"")
        .replaceAll("<age>", ", \"age\": \"")
        .replaceAll("</age>", "\"")
        .replaceAll("<[^>]+>", "") // Xóa các tag còn lại
        .trim();

    return "{" + json + "}";
  }

  // JSON sang XML đơn giản
  public String jsonToXml(String jsonString) {
    // Xóa dấu { } và split thành các cặp key-value
    String cleanJson = jsonString.replace("{", "").replace("}", "");
    String[] pairs = cleanJson.split(",");

    StringBuilder xml = new StringBuilder("<person>");
    for (String pair : pairs) {
      String[] kv = pair.split(":");
      String key = kv[0].trim().replace("\"", "");
      String value = kv[1].trim().replace("\"", "");
      xml.append("<").append(key).append(">")
          .append(value)
          .append("</").append(key).append(">");
    }
    xml.append("</person>");

    return xmlSystem.processXML(xml.toString());
  }
}
