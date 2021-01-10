from locust import HttpUser, task


class UrlShortener(HttpUser):
    @task
    def health_check(self):
        self.client.get("/")

    @task
    def shorten_url(self):
        self.client.post("/urls", json={"url": "https://www.google.com"})
