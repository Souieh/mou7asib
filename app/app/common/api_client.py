# coding:utf-8
import requests
from .config import cfg

class APIClient:
    """ API client for Mou7asib """

    def __init__(self):
        self.base_url = cfg.get(cfg.apiUrl)

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
