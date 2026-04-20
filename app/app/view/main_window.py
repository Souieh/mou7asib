# coding: utf-8
from PyQt5.QtCore import QSize, QTimer, QUrl
from PyQt5.QtGui import QDesktopServices, QIcon
from PyQt5.QtWidgets import QApplication
from qfluentwidgets import FluentIcon as FIF
from qfluentwidgets import (
    FluentWindow,
    NavigationItemPosition,
    SplashScreen,
    SystemThemeListener,
    isDarkTheme,
)

from ..common import resource
from ..common.config import cfg
from ..common.icon import Icon
from ..common.signal_bus import signalBus
from .todo_interface import TODOInterface

# Prevent auto-removal by vscode import oganizer
_ = resource  #


class MainWindow(FluentWindow):
    def __init__(self):
        super().__init__()
        self.initWindow()

        # create system theme listener
        self.themeListener = SystemThemeListener(self)

        # create sub interface
        self.dashboardInterface = TODOInterface("Dashboard", "dashboardInterface", "dashboard", self)
        self.chartOfAccountsInterface = TODOInterface("Chart of Accounts", "chartOfAccountsInterface", "accounts", self)
        self.journalEntriesInterface = TODOInterface("Journal Entries", "journalEntriesInterface", "journal-entries", self)
        self.generalLedgerInterface = TODOInterface("General Ledger", "generalLedgerInterface", "ledger", self)
        self.contactsInterface = TODOInterface("Contacts", "contactsInterface", "contacts", self)
        self.invoicesInterface = TODOInterface("Invoices", "invoicesInterface", "invoices", self)
        self.budgetCommitmentsInterface = TODOInterface("Budget Commitments", "budgetCommitmentsInterface", "commitments", self)
        self.fiscalPeriodsInterface = TODOInterface("Fiscal Periods", "fiscalPeriodsInterface", "periods", self)
        self.reportsInterface = TODOInterface("Reports", "reportsInterface", "reports", self)
        self.auditLogInterface = TODOInterface("Audit Log", "auditLogInterface", "audit-log", self)
        self.settingsInterface = TODOInterface("Settings", "settingsInterface", None, self)

        # enable acrylic effect
        self.navigationInterface.setAcrylicEnabled(True)

        self.connectSignalToSlot()

        # add items to navigation interface
        self.initNavigation()

        # start theme listener
        self.themeListener.start()

    def connectSignalToSlot(self):
        signalBus.micaEnableChanged.connect(self.setMicaEffectEnabled)

    def initNavigation(self):
        # add navigation items
        self.addSubInterface(self.dashboardInterface, FIF.HOME, "Dashboard")
        self.addSubInterface(self.chartOfAccountsInterface, FIF.ALBUM, "Chart of Accounts")
        self.addSubInterface(self.journalEntriesInterface, FIF.EDIT, "Journal Entries")
        self.addSubInterface(self.generalLedgerInterface, FIF.BOOK_SHELF, "General Ledger")
        self.addSubInterface(self.contactsInterface, FIF.PEOPLE, "Contacts")
        self.addSubInterface(self.invoicesInterface, FIF.PRINT, "Invoices")
        self.addSubInterface(self.budgetCommitmentsInterface, FIF.CALENDAR, "Budget Commitments")
        self.addSubInterface(self.fiscalPeriodsInterface, FIF.DATE_TIME, "Fiscal Periods")
        self.addSubInterface(self.reportsInterface, FIF.DOCUMENT, "Reports")
        self.addSubInterface(self.auditLogInterface, FIF.HISTORY, "Audit Log")

        self.addSubInterface(
            self.settingsInterface,
            FIF.SETTING,
            "Settings",
            NavigationItemPosition.BOTTOM,
        )

    def initWindow(self):
        self.resize(960, 780)
        self.setMinimumWidth(760)
        self.setWindowIcon(QIcon(":/gallery/images/logo.png"))
        self.setWindowTitle("Mou7asib Desktop")

        self.setMicaEffectEnabled(cfg.get(cfg.micaEnabled))

        desktop = QApplication.desktop().availableGeometry()
        w, h = desktop.width(), desktop.height()
        self.move(w // 2 - self.width() // 2, h // 2 - self.height() // 2)
        self.show()
        QApplication.processEvents()

    def resizeEvent(self, e):
        super().resizeEvent(e)

    def closeEvent(self, e):
        self.themeListener.terminate()
        self.themeListener.deleteLater()
        super().closeEvent(e)

    def _onThemeChangedFinished(self):
        super()._onThemeChangedFinished()

        # retry
        if self.isMicaEffectEnabled():
            QTimer.singleShot(
                100,
                lambda: self.windowEffect.setMicaEffect(self.winId(), isDarkTheme()),
            )
