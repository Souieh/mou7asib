# coding:utf-8
from PyQt5.QtCore import Qt, pyqtSignal
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel

from qfluentwidgets import PrimaryPushButton, TitleLabel, SubtitleLabel
from qfluentwidgets import FluentIcon as FIF


class ErrorInterface(QWidget):
    """ Error interface """
    retrySignal = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent=parent)
        self.setWindowTitle("Mou7asib - Connection Error")
        self.setWindowIcon(QIcon(":/gallery/images/logo.png"))
        self.resize(500, 400)

        self.vBoxLayout = QVBoxLayout(self)
        self.vBoxLayout.setContentsMargins(40, 40, 40, 40)
        self.vBoxLayout.setSpacing(20)
        self.vBoxLayout.setAlignment(Qt.AlignCenter)

        self.iconLabel = QLabel(self)
        self.iconLabel.setPixmap(FIF.WIFI_OFF.icon(Qt.red).pixmap(100, 100))
        self.iconLabel.setAlignment(Qt.AlignCenter)
        self.vBoxLayout.addWidget(self.iconLabel)

        self.titleLabel = TitleLabel("Connection Failed", self)
        self.titleLabel.setAlignment(Qt.AlignCenter)
        self.vBoxLayout.addWidget(self.titleLabel)

        self.contentLabel = SubtitleLabel(
            "The application cannot connect to the server API.\n"
            "Please check your internet connection or API configuration.",
            self
        )
        self.contentLabel.setAlignment(Qt.AlignCenter)
        self.vBoxLayout.addWidget(self.contentLabel)

        self.retryButton = PrimaryPushButton("Retry Connection", self)
        self.retryButton.setFixedWidth(200)
        self.retryButton.clicked.connect(self.retrySignal.emit)
        self.vBoxLayout.addWidget(self.retryButton, 0, Qt.AlignCenter)
