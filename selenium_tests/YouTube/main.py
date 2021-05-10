from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
import json

# Prihlasi se do uctu Google, prejde na YT, nacte 5. video a diva se na nej 20 sekund
# Pak se uspi na 30s a pusti novy test - 50x dokola

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')

        options.add_argument('user-agent=false_user_agent')
        
        options.add_argument('accept-languagea=ahoj')

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        sleep(5)
        self.driver.get("https://youtube.com")

        # Accept cookies
        try:
            self.search_cookie_accept = self.driver.find_element_by_xpath("//button[@title='Accept All']").click()
        except:
            pass
        
        # Fill login
        self.search_login_form = self.driver.find_element_by_id("email")
        self.search_login_form.send_keys(username)
        sleep(3)

        # Fill password
        self.search_pass_form = self.driver.find_element_by_id("pass")
        self.search_pass_form.send_keys(password)
        sleep(3)

        # Hit enter
        self.search_pass_form.send_keys(Keys.RETURN)

        sleep(3)
        self.driver.execute_script("window.scrollTo(0, 1000)") 
        sleep(3)
        
        try:
            sleep(4)
            spans[0].click()
        except:
            print("Nepodarilo se nacist prvni prispevek")
            
        sleep(30)
        self.driver.quit()


# Config data - login and password
with open('./configs/credentials.json') as f:
    credentials = json.load(f)

for i in range(50):
    page = Page(credentials['username'], credentials['password'])
    sleep(60)






