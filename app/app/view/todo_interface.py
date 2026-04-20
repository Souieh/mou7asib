# coding:utf-8
import json
from PyQt5.QtCore import Qt, QRectF, QThread, pyqtSignal
from PyQt5.QtGui import QPixmap, QPainter, QColor, QBrush, QPainterPath, QLinearGradient
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QTextEdit

from qfluentwidgets import ScrollArea, isDarkTheme, FluentIcon
from ..common.config import cfg
from ..common.style_sheet import StyleSheet
from ..common.api_client import apiClient


class BannerWidget(QWidget):
    """ Banner widget """

    def __init__(self, title, parent=None):
        super().__init__(parent=parent)
        self.setFixedHeight(200)

        self.vBoxLayout = QVBoxLayout(self)
        self.galleryLabel = QLabel(title, self)
        self.banner = QPixmap(':/gallery/images/header1.png')

        self.galleryLabel.setObjectName('galleryLabel')

        self.vBoxLayout.setSpacing(0)
        self.vBoxLayout.setContentsMargins(36, 20, 0, 0)
        self.vBoxLayout.addWidget(self.galleryLabel)
        self.vBoxLayout.setAlignment(Qt.AlignLeft | Qt.AlignTop)

    def paintEvent(self, e):
        super().paintEvent(e)
        painter = QPainter(self)
        painter.setRenderHints(
            QPainter.SmoothPixmapTransform | QPainter.Antialiasing)
        painter.setPen(Qt.NoPen)

        path = QPainterPath()
        path.setFillRule(Qt.WindingFill)
        w, h = self.width(), self.height()
        path.addRoundedRect(QRectF(0, 0, w, h), 10, 10)
        path.addRect(QRectF(0, h-50, 50, 50))
        path.addRect(QRectF(w-50, 0, 50, 50))
        path.addRect(QRectF(w-50, h-50, 50, 50))
        path = path.simplified()

        # init linear gradient effect
        gradient = QLinearGradient(0, 0, 0, h)

        # draw background color
        if not isDarkTheme():
            gradient.setColorAt(0, QColor(207, 216, 228, 255))
            gradient.setColorAt(1, QColor(207, 216, 228, 0))
        else:
            gradient.setColorAt(0, QColor(0, 0, 0, 255))
            gradient.setColorAt(1, QColor(0, 0, 0, 0))

        painter.fillPath(path, QBrush(gradient))

        # draw banner image
        if not self.banner.isNull():
            pixmap = self.banner.scaled(
                self.size(), transformMode=Qt.SmoothTransformation)
            painter.fillPath(path, QBrush(pixmap))


class FetchDataThread(QThread):
    """ Thread to fetch data from API """
    dataFetched = pyqtSignal(object)

    def __init__(self, endpoint):
        super().__init__()
        self.endpoint = endpoint

    def run(self):
        data = apiClient.get(self.endpoint)
        self.dataFetched.emit(data)


class TODOInterface(ScrollArea):
    """ TODO interface """

    def __init__(self, title, objectName, endpoint=None, parent=None):
        super().__init__(parent=parent)
        self.view = QWidget(self)
        self.vBoxLayout = QVBoxLayout(self.view)
        self.banner = BannerWidget(title, self)
        self.endpoint = endpoint

        self.setObjectName(objectName)
        self.__initWidget()

        if self.endpoint:
            self.loadData()

    def __initWidget(self):
        self.view.setObjectName('view')
        StyleSheet.HOME_INTERFACE.apply(self)

        self.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.setWidget(self.view)
        self.setWidgetResizable(True)

        self.vBoxLayout.setContentsMargins(0, 0, 0, 36)
        self.vBoxLayout.setSpacing(40)
        self.vBoxLayout.addWidget(self.banner)

        self.dataLabel = QLabel(self.view)
        self.dataLabel.setContentsMargins(36, 0, 36, 0)
        self.vBoxLayout.addWidget(self.dataLabel)

        if self.endpoint:
            self.dataLabel.setText("Loading data from API...")
        else:
            self.dataLabel.setText("This interface is under development.")

        self.dataDisplay = QTextEdit(self.view)
        self.dataDisplay.setReadOnly(True)
        self.dataDisplay.setMinimumHeight(400)
        self.dataDisplay.setVisible(False)
        self.vBoxLayout.addWidget(self.dataDisplay)

        self.vBoxLayout.setAlignment(Qt.AlignTop)

    def loadData(self):
        """ load data from API """
        self.thread = FetchDataThread(self.endpoint)
        self.thread.dataFetched.connect(self.onDataFetched)
        self.thread.start()

    def onDataFetched(self, data):
        """ data fetched slot """
        if data is None:
            self.dataLabel.setText(f"Failed to fetch data from API endpoint: {self.endpoint}")
        else:
            self.dataLabel.setText(f"Data from API endpoint: {self.endpoint}")
            self.dataDisplay.setText(json.dumps(data, indent=4, ensure_ascii=False))
            self.dataDisplay.setVisible(True)
