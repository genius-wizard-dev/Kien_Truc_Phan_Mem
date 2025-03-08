from abc import ABC, abstractmethod

class ThemeConfig:
    _instance = None
    _dark_mode = False

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def toggle_dark_mode(self):
        self._dark_mode = not self._dark_mode
        return self.get_factory()

    def get_factory(self):
        return DarkThemeFactory() if self._dark_mode else LightThemeFactory()

class ThemeFactory(ABC):
    @abstractmethod
    def create_button(self): pass

    @abstractmethod
    def create_panel(self): pass

class LightThemeFactory(ThemeFactory):
    def create_button(self):
        return LightButton()

    def create_panel(self):
        return LightPanel()

class DarkThemeFactory(ThemeFactory):
    def create_button(self):
        return DarkButton()

    def create_panel(self):
        return DarkPanel()


class LightButton:
    def render(self):
        print("Nút màu trắng, viền xanh dương")

class LightPanel:
    def render(self):
        print("Panel sáng, chữ đen")

class DarkButton:
    def render(self):
        print("Nút đen, viền neon")

class DarkPanel:
    def render(self):
        print("Panel tối, chữ trắng")

def display_ui():
    config = ThemeConfig()
    factory = config.get_factory()

    button = factory.create_button()
    panel = factory.create_panel()

    button.render()
    panel.render()

# Theme mặc định: Light
print("Light theme:")
display_ui()

# Chuyển sang Dark theme
ThemeConfig().toggle_dark_mode()
print("\nDark theme:")
display_ui()
