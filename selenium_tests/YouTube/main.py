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
        #options.add_argument('--headless')
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
        
        # Page source code
        # print(self.driver.page_source, "\n\n")

        spans = self.driver.find_elements_by_xpath("//span[@class='pcp91wgn']")
        # self.driver.find_elements_by_class_name("pcp91wgn")
        
        try:
            print("Prvni prispevek ma ", spans[0].text)
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






