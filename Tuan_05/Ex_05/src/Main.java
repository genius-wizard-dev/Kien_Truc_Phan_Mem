import source.DataFormatAdapter;

public class Main {
  public static void main(String[] args) {
    DataFormatAdapter adapter = new DataFormatAdapter();

    // XML to JSON
    String xmlInput = "<person><name>John</name><age>25</age></person>";
    String jsonOutput = adapter.xmlToJson(xmlInput);
    System.out.println("XML to JSON: " + jsonOutput);

    // JSON to XML
    String jsonInput = "{\"name\": \"Jane\", \"age\": \"30\"}";
    String xmlOutput = adapter.jsonToXml(jsonInput);
    System.out.println("JSON to XML: " + xmlOutput);
  }
}
