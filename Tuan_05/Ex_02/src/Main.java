import source.Button;
import source.Panel;
import source.Text;

public class Main {
  public static void main(String[] args) throws Exception {
    Button loginButton = new Button("Login");
    Button registerButton = new Button("Register");
    Text headerText = new Text("Welcome to our application");

    Panel headerPanel = new Panel("\tHeader Panel");
    headerPanel.add(headerText);

    Panel formPanel = new Panel("\tForm Panel");
    formPanel.add(loginButton);
    formPanel.add(registerButton);

    Panel mainPanel = new Panel("Main Panel");
    mainPanel.add(headerPanel);
    mainPanel.add(formPanel);

    mainPanel.render();
  }
}
