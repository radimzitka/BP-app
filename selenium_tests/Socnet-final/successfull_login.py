from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
import json

# Po spusteni skriptu nacte FB stranku, prihlasi se, sjede dolu a nacte pocet lajku u prvniho prispevku
# Prvni prispevek najde tak, ze vyhleda span tridu 'pcp91wgn'

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        sleep(4)
        self.driver.get("http://localhost:8080/")
        
        # Fill login
        self.search_login_form = self.driver.find_element_by_name("username")
        self.search_login_form.send_keys(username)
        sleep(1)

        # Fill password
        self.search_pass_form = self.driver.find_element_by_name("password")
        self.search_pass_form.send_keys(password)
        sleep(1)

        # Hit enter
        self.search_pass_form.send_keys(Keys.RETURN)
            
        sleep(40)
        self.driver.quit()


# Config data - login and password
with open('./configs/credentials.json') as f:
    credentials = json.load(f)


page = Page(credentials['username'], credentials['password'])






