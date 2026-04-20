# coding:utf-8
import requests
from .config import cfg

class APIClient:
    """ API client for Mou7asib """

    def __init__(self):
        self.base_url = cfg.get(cfg.apiUrl)

    def check_connection(self):
        """ Check if API is reachable """
        try:
            # We can use the dashboard endpoint or just a simple ping if available
            # For now let's use dashboard
            response = requests.get(f"{self.base_url}/dashboard", timeout=5)
            return response.status_code == 200
        except:
            return False

    def get(self, endpoint):
        """ GET request """
        try:
            response = requests.get(f"{self.base_url}/{endpoint}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"API GET Error: {e}")
            return None

    def post(self, endpoint, data):
        """ POST request """
        try:
            response = requests.post(f"{self.base_url}/{endpoint}", json=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"API POST Error: {e}")
            return None

apiClient = APIClient()
