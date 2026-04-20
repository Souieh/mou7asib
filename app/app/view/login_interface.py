# coding:utf-8
from PyQt5.QtCore import Qt, pyqtSignal, QSize
from PyQt5.QtGui import QIcon, QPixmap
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QSpacerItem, QSizePolicy

from qfluentwidgets import (LineEdit, PasswordLineEdit, PrimaryPushButton, HyperlinkButton,
                            CheckBox, SubtitleLabel, CaptionLabel, InfoBar, InfoBarPosition)
from qfluentwidgets import FluentIcon as FIF


class LoginInterface(QWidget):
    """ Login interface """
    loginSuccess = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent=parent)
        self.setWindowTitle("Mou7asib Login")
        self.setWindowIcon(QIcon(":/gallery/images/logo.png"))
        self.resize(400, 600)

        self.vBoxLayout = QVBoxLayout(self)
        self.vBoxLayout.setContentsMargins(40, 40, 40, 40)
        self.vBoxLayout.setSpacing(20)

        # logo and title
        self.logoLabel = QLabel(self)
        self.logoLabel.setPixmap(QPixmap(":/gallery/images/logo.png").scaled(80, 80, Qt.KeepAspectRatio, Qt.SmoothTransformation))
        self.logoLabel.setAlignment(Qt.AlignCenter)
        self.vBoxLayout.addWidget(self.logoLabel)

        self.titleLabel = SubtitleLabel("Welcome to Mou7asib", self)
        self.titleLabel.setAlignment(Qt.AlignCenter)
        self.vBoxLayout.addWidget(self.titleLabel)

        self.captionLabel = CaptionLabel("Log in to your account to continue", self)
        self.captionLabel.setAlignment(Qt.AlignCenter)
        self.vBoxLayout.addWidget(self.captionLabel)

        self.vBoxLayout.addSpacing(20)

        # inputs
        self.usernameLineEdit = LineEdit(self)
        self.usernameLineEdit.setPlaceholderText("Username")
        self.usernameLineEdit.setClearButtonEnabled(True)
        self.usernameLineEdit.setPrefixIcon(FIF.PEOPLE)
        self.vBoxLayout.addWidget(self.usernameLineEdit)

        self.passwordLineEdit = PasswordLineEdit(self)
        self.passwordLineEdit.setPlaceholderText("Password")
        self.passwordLineEdit.setClearButtonEnabled(True)
        self.vBoxLayout.addWidget(self.passwordLineEdit)

        # remember me and forgot password
        self.hBoxLayout = QHBoxLayout()
        self.rememberCheckBox = CheckBox("Remember me", self)
        self.forgotPasswordButton = HyperlinkButton("Forgot password?", self)
        self.hBoxLayout.addWidget(self.rememberCheckBox)
        self.hBoxLayout.addStretch(1)
        self.hBoxLayout.addWidget(self.forgotPasswordButton)
        self.vBoxLayout.addLayout(self.hBoxLayout)

        self.vBoxLayout.addSpacing(10)

        # login button
        self.loginButton = PrimaryPushButton("Log in", self)
        self.loginButton.clicked.connect(self.__onLogin)
        self.vBoxLayout.addWidget(self.loginButton)

        # footer
        self.footerLabel = CaptionLabel("Don't have an account?", self)
        self.signupButton = HyperlinkButton("Sign up", self)
        self.footerLayout = QHBoxLayout()
        self.footerLayout.setAlignment(Qt.AlignCenter)
        self.footerLayout.addWidget(self.footerLabel)
        self.footerLayout.addWidget(self.signupButton)
        self.vBoxLayout.addStretch(1)
        self.vBoxLayout.addLayout(self.footerLayout)

        self.__initWidget()

    def __initWidget(self):
        self.usernameLineEdit.setFixedSize(320, 33)
        self.passwordLineEdit.setFixedSize(320, 33)
        self.loginButton.setFixedSize(320, 35)

    def __onLogin(self):
        username = self.usernameLineEdit.text()
        password = self.passwordLineEdit.text()

        if not username or not password:
            InfoBar.error(
                title="Error",
                content="Username or password cannot be empty",
                orient=Qt.Horizontal,
                isClosable=True,
                position=InfoBarPosition.TOP,
                duration=2000,
                parent=self
            )
            return

        # Simple mock authentication
        if username == "admin" and password == "admin":
            self.loginSuccess.emit()
        else:
            InfoBar.error(
                title="Login failed",
                content="Invalid username or password",
                orient=Qt.Horizontal,
                isClosable=True,
                position=InfoBarPosition.TOP,
                duration=2000,
                parent=self
            )
