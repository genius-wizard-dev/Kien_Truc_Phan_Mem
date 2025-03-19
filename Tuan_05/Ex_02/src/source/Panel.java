package source;

import java.util.ArrayList;
import java.util.List;

public class Panel implements UIComponent {
  private List<UIComponent> components = new ArrayList<>();
  private String name;

  public Panel(String name) {
    this.name = name;
  }

  @Override
  public void add(UIComponent component) {
    components.add(component);
  }

  @Override
  public void remove(UIComponent component) {
    components.remove(component);
  }

  @Override
  public void render() {
    System.out.println(name);
    for (UIComponent component : components) {
      component.render();
    }
  }

}
