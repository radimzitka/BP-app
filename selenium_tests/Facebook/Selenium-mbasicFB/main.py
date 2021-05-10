from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
import json

# Spusteni skriptu, ktery 50x za sebou spusti FB, kde ulozi prvni prispevek

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')
        #options.add_argument('--headless')
        options.add_argument('user-agent=false_user_agent')

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        sleep(5)
        self.driver.get("https://mbasic.facebook.com")
        
        # Fill login
        self.search_login_form = self.driver.find_element_by_id("m_login_email")
        self.search_login_form.send_keys(username)
        sleep(3)

        # Fill password
        self.search_pass_form = self.driver.find_element_by_name("pass")
        self.search_pass_form.send_keys(password)
        sleep(3)

        # Hit enter
        self.search_pass_form.send_keys(Keys.RETURN)
        sleep(5)

        self.driver.find_element_by_link_text("Log In").click()

        # Fill login
        self.search_login_form = self.driver.find_element_by_id("m_login_email")
        self.search_login_form.send_keys(username)
        sleep(3)

        # Fill password
        self.search_pass_form = self.driver.find_element_by_name("pass")
        self.search_pass_form.send_keys(password)
        sleep(3)

        # Hit enter
        self.search_pass_form.send_keys(Keys.RETURN)
        sleep(5)

        self.driver.execute_script("window.scrollTo(0, 1000)") 
        sleep(3)
        # Page source code
        # print(self.driver.page_source, "\n\n")
        try:
            self.driver.find_element_by_link_text("Uložit").click()
        # self.driver.find_elements_by_class_name("pcp91wgn")
        except:
            pass
        sleep(30)
        self.driver.quit()


# Config data - login and password
with open('./configs/credentials.json') as f:
    credentials = json.load(f)

for i in range(50):
    page = Page(credentials['username'], credentials['password'])
    sleep(60)





