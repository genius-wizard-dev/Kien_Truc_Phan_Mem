package source;

public class Text implements UIComponent {
  private String text;

  public Text(String text) {
    this.text = text;
  }

  @Override
  public void render() {
    System.out.println("\t\tText: " + text);
  }

  @Override
  public void add(UIComponent component) {
  }

  @Override
  public void remove(UIComponent component) {
  }

}
