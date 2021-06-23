from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
import json

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        self.driver.get("http://localhost:8080/")
        
        # Fill login
        self.search_login_form = self.driver.find_element_by_name("username")
        self.search_login_form.send_keys(username)
        sleep(2)

        # Fill password
        self.search_pass_form = self.driver.find_element_by_name("password")
        self.search_pass_form.send_keys(password)
        sleep(2)

        # Hit enter
        self.search_pass_form.send_keys(Keys.RETURN)
            
        sleep(30)
        self.driver.quit()


# Config data - login and password
with open('./configs/credentials.json') as f:
    credentials = json.load(f)


page = Page(credentials['username'], credentials['password'])






