# coding:utf-8
import os
import sys

# Change working directory to the directory of main.py to ensure relative paths work
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Add the parent directory to sys.path to allow importing 'app' as a package if needed
# although usually we run it as `python -m app.main` or similar if it's a package.
# Here it seems it's designed to be run as `python main.py` inside `app/`
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from PyQt5.QtCore import Qt, QSize, QTimer
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication
from qfluentwidgets import SplashScreen

from app.common.config import cfg
from app.common.api_client import apiClient
from app.view.main_window import MainWindow
from app.view.login_interface import LoginInterface
from app.view.error_interface import ErrorInterface


class AppController:
    def __init__(self):
        # enable dpi scale
        if cfg.get(cfg.dpiScale) == "Auto":
            QApplication.setHighDpiScaleFactorRoundingPolicy(
                Qt.HighDpiScaleFactorRoundingPolicy.PassThrough)
            QApplication.setAttribute(Qt.AA_EnableHighDpiScaling)
        else:
            os.environ["QT_ENABLE_HIGHDPI_SCALING"] = "0"
            os.environ["QT_SCALE_FACTOR"] = str(cfg.get(cfg.dpiScale))

        QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps)

        self.app = QApplication(sys.argv)
        self.app.setAttribute(Qt.AA_DontCreateNativeWidgetSiblings)

        self.loginWindow = None
        self.mainWindow = None
        self.errorWindow = None

        self.splashScreen = SplashScreen(QIcon(":/gallery/images/logo.png"), None)
        self.splashScreen.setIconSize(QSize(106, 106))
        self.splashScreen.show()

    def run(self):
        # Use a timer to simulate background check and allow splash screen to show
        QTimer.singleShot(1000, self.checkConnection)
        sys.exit(self.app.exec_())

    def checkConnection(self):
        if apiClient.check_connection():
            self.showLogin()
        else:
            self.showError()

    def showLogin(self):
        if self.splashScreen:
            self.splashScreen.finish()
            self.splashScreen = None

        if self.errorWindow:
            self.errorWindow.close()
            self.errorWindow = None

        self.loginWindow = LoginInterface()
        self.loginWindow.loginSuccess.connect(self.showMain)
        self.loginWindow.show()

    def showError(self):
        if self.splashScreen:
            self.splashScreen.finish()
            self.splashScreen = None

        if not self.errorWindow:
            self.errorWindow = ErrorInterface()
            self.errorWindow.retrySignal.connect(self.checkConnection)

        self.errorWindow.show()

    def showMain(self):
        if self.loginWindow:
            self.loginWindow.close()
            self.loginWindow = None

        self.mainWindow = MainWindow()
        # MainWindow has its own internal splash screen in its __init__,
        # but since we already showed one, we might want to disable it there.
        # For now I'll leave it as is or fix it in main_window.py if needed.
        self.mainWindow.show()


if __name__ == '__main__':
    controller = AppController()
    controller.run()
