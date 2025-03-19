package source;

public class Button implements UIComponent {
  private String label;

  public Button(String label) {
    this.label = label;
  }

  @Override
  public void render() {
    System.out.println("\t\tButton" + label);
  }

  @Override
  public void add(UIComponent component) {
  }

  @Override
  public void remove(UIComponent component) {
  }

}
